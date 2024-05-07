import Advert, { AdvertPlaceholder } from "@/components/Advert";
import repeatComponent from "@/utils/repeatComponent";
import { useMemo } from "react";
import { IonCol, IonGrid, IonRow } from "@ionic/react";

export default function AdvertList({
  isPending = true,
  isSuccess = false,
  data,
}) {
  const adverts = useMemo(
    () => data?.pages.reduce((carry, page) => carry.concat(page.data), []),
    [data]
  );

  return (
    <IonGrid className="w-full p-0">
      <IonRow>
        {isPending
          ? repeatComponent(
              <AdvertCol>
                <AdvertPlaceholder />
              </AdvertCol>,
              10
            )
          : isSuccess
          ? adverts.map((advert) => {
              return (
                <AdvertCol key={advert["id"]}>
                  <Advert advert={advert} className="h-full" />
                </AdvertCol>
              );
            })
          : null}
      </IonRow>
    </IonGrid>
  );
}

const AdvertCol = (props) => (
  <IonCol size="6" sizeSm="4" sizeMd="3" {...props} />
);
