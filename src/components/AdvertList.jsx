import Advert, { AdvertPlaceholder } from "@/components/Advert";
import repeatComponent from "@/utils/repeatComponent";
import { useMemo } from "react";
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCol,
  IonGrid,
  IonIcon,
  IonList,
  IonRow,
} from "@ionic/react";
import { gridOutline, listOutline } from "ionicons/icons";
import useApp from "@/hooks/useApp";

export default function AdvertList({
  title,
  isPending = true,
  isSuccess = false,
  data,
}) {
  const { advertListStyle: mode, setAdvertListStyle } = useApp();
  const adverts = useMemo(
    () => data?.pages.reduce((carry, page) => carry.concat(page.data), []),
    [data]
  );

  return (
    <>
      <div className="flex items-center gap-4">
        {title ? <h5 className="font-bold grow">{title}</h5> : null}
        <div className="ml-auto">
          {/* List Toggle */}
          <IonButton
            color={mode === "list" ? "primary" : "dark"}
            onClick={() => setAdvertListStyle("list")}
            fill="clear"
          >
            <IonIcon icon={listOutline} />
          </IonButton>

          {/* Grid Toggle */}
          <IonButton
            color={mode === "grid" ? "primary" : "dark"}
            onClick={() => setAdvertListStyle("grid")}
            fill="clear"
          >
            <IonIcon icon={gridOutline} />
          </IonButton>
        </div>
      </div>

      {mode === "list" ? (
        <IonList>
          {isPending ? (
            repeatComponent(<AdvertPlaceholder mode={mode} />, 10)
          ) : isSuccess ? (
            adverts.length ? (
              adverts.map((advert) => {
                return (
                  <Advert
                    key={advert["id"]}
                    advert={advert}
                    className="h-full"
                    mode={mode}
                  />
                );
              })
            ) : (
              <IonCard color={"tertiary"} className="ion-no-margin">
                <IonCardContent>No advert to show</IonCardContent>
              </IonCard>
            )
          ) : null}
        </IonList>
      ) : (
        <IonGrid className="w-full p-0">
          <IonRow className="-mx-[var(--ion-grid-column-padding)]">
            {isPending
              ? repeatComponent(
                  <AdvertCol mode={mode}>
                    <AdvertPlaceholder />
                  </AdvertCol>,
                  10
                )
              : isSuccess
              ? adverts.map((advert) => {
                  return (
                    <AdvertCol key={advert["id"]} mode={mode}>
                      <Advert advert={advert} className="h-full" mode={mode} />
                    </AdvertCol>
                  );
                })
              : null}
          </IonRow>
        </IonGrid>
      )}
    </>
  );
}

const AdvertCol = ({ mode, ...props }) => {
  const colProps =
    mode === "grid"
      ? {
          size: "6",
          sizeSm: "4",
          sizeMd: "3",
        }
      : {
          size: "12",
          sizeSm: "12",
          sizeMd: "12",
        };
  return <IonCol {...colProps} {...props} />;
};
