import api from "@/lib/api";
import {
  IonIcon,
  IonItem,
  IonLabel,
  IonModal,
  IonNote,
  IonSpinner,
  IonThumbnail,
} from "@ionic/react";
import { useQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { useMemo } from "react";
import { useId } from "react";
import MultiLevelSelect from "./MultiLevelSelect";
import { checkmark } from "ionicons/icons";

const CategoryMultiLevelSelect = ({ value = null, onSelect }) => {
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
      <IonItem id={id}>
        {selected ? (
          <>
            <IonNote slot="end">Category</IonNote>
            <IonThumbnail slot="start" className="[--size:theme(spacing.10)]">
              <img
                alt={selected["name"]}
                src={selected["image"] ? selected["image"]["src"] : null}
              />
            </IonThumbnail>
            <IonLabel>
              <h3 className="ion-text-wrap">{selected["name"]}</h3>
              <p>₦{selected["cost"]}</p>
            </IonLabel>
          </>
        ) : (
          <IonLabel>
            <h3>Category</h3>
            <p>{isPending ? "Loading..." : "Select Category"}</p>
          </IonLabel>
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
                  src={item["image"] ? item["image"]["src"] : null}
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
