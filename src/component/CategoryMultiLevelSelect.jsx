import api from "@/lib/api";
import {
  IonIcon,
  IonItem,
  IonLabel,
  IonModal,
  IonSpinner,
  IonText,
  IonThumbnail,
} from "@ionic/react";
import { useQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { useMemo } from "react";
import { useId } from "react";
import MultiLevelSelect from "./MultiLevelSelect";
import { checkmark } from "ionicons/icons";

const CategoryMultiLevelSelect = ({ errorText, value = null, onSelect }) => {
  const id = "category-multilevel-select-" + useId();
  const modalRef = useRef();

  const { isPending, data } = useQuery({
    queryKey: ["categories", "index", "all"],
    queryFn: ({ signal }) =>
      api
        .get("/categories?filter=all", { signal })
        .then((response) => response.data),
  });

  const items = useMemo(() => data || [], [data]);

  const selected = useMemo(
    () => items.find((item) => item.id === value),
    [value]
  );

  const dismiss = () => modalRef.current?.dismiss();
  const handleCancel = () => dismiss();
  const handleSelect = (id) => {
    dismiss();
    onSelect(id);
  };

  return (
    <>
      <IonItem button id={id}>
        {selected ? (
          <>
            <IonThumbnail slot="start" className="[--size:theme(spacing.10)]">
              <img
                alt={selected["name"]}
                src={selected["image"]?.["cache"]?.["extra-small"]}
                className="object-cover object-center w-full h-full"
              />
            </IonThumbnail>
            <div className="flex flex-col gap-1">
              <h3 className="text-xs ion-no-margin">
                <IonText color={errorText ? "danger" : "primary"}>
                  Category
                </IonText>
              </h3>
              <h4 className="text-sm ion-text-wrap ion-no-margin">
                {selected["name"]}
              </h4>

              {/* Price */}
              <p className="text-sm ion-no-margin">
                <IonText color={"medium"}>₦{selected["cost"]}</IonText>
              </p>
              {errorText ? (
                <p className="text-xs">
                  <IonText color={"danger"}>{errorText}</IonText>
                </p>
              ) : null}
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col gap-1">
              <h3 className="text-xs ion-no-margin">
                <IonText color={errorText ? "danger" : "primary"}>
                  Category
                </IonText>
              </h3>
              <p className="text-sm ion-no-margin">
                <IonText color={"medium"}>
                  {isPending ? "Loading..." : "Select Category"}
                </IonText>
              </p>
              {errorText ? (
                <p className="text-xs">
                  <IonText color={"danger"}>{errorText}</IonText>
                </p>
              ) : null}
            </div>
          </>
        )}

        {isPending ? <IonSpinner slot="end" /> : null}
      </IonItem>
      <IonModal trigger={id} ref={modalRef}>
        <MultiLevelSelect
          items={items}
          selected={value}
          title="Select Category"
          handleCancel={handleCancel}
          handleSelect={handleSelect}
          renderItem={({ item, active, ...props }) => (
            <IonItem {...props}>
              <IonThumbnail slot="start" className="[--size:theme(spacing.10)]">
                <img
                  alt={item["name"]}
                  src={item["image"]?.["cache"]?.["extra-small"]}
                  className="object-cover object-center w-full h-full"
                />
              </IonThumbnail>
              <IonLabel>
                <h4>{item["name"]}</h4>
                {item["cost"] ? <p>₦{item["cost"]}</p> : null}
              </IonLabel>
              {active ? <IonIcon icon={checkmark} color="primary" /> : null}
            </IonItem>
          )}
        />
      </IonModal>
    </>
  );
};

export default CategoryMultiLevelSelect;
