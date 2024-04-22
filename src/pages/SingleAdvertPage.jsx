import {
  IonBackButton,
  IonButtons,
  IonCol,
  IonContent,
  IonGrid,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import Header from "../component/Header";
import { useParams } from "react-router";
import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import Advert, { AdvertPlaceholder } from "@/component/Advert";

export default function SingleAdvertPage() {
  const { id } = useParams();
  const {
    isPending,
    isSuccess,
    data: advert,
  } = useQuery({
    queryKey: ["advert", id],
    queryFn: ({ signal }) =>
      api.get(`/adverts/${id}`, { signal }).then((response) => response.data),
  });

  return (
    <IonPage>
      <Header>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/"></IonBackButton>
          </IonButtons>
          <IonTitle>
            {isPending ? "Loading..." : isSuccess ? advert["title"] : "Error!"}
          </IonTitle>
        </IonToolbar>
      </Header>

      <IonContent className="ion-padding" fullscreen>
        <IonGrid>
          <IonRow className="ion-justify-start">
            <IonCol sizeXl="6">
              {isPending ? <AdvertPlaceholder /> : <Advert advert={advert} />}
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
}
