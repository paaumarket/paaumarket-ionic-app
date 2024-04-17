import { IonCol, IonContent, IonGrid, IonPage, IonRow } from "@ionic/react";
import Header from "../component/Header";
import { useParams } from "react-router";
import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import Advert, { AdvertPlaceholder } from "@/component/Advert";

export default function SingleAdvertPage() {
  const { id } = useParams();
  const { isPending, data } = useQuery({
    queryKey: ["advert", id],
    queryFn: ({ signal }) =>
      api.get(`/adverts/${id}`, { signal }).then((response) => response.data),
  });

  return (
    <IonPage>
      <Header></Header>

      <IonContent className="ion-padding">
        <IonGrid>
          <IonRow>
            <IonCol>
              {isPending ? <AdvertPlaceholder /> : <Advert advert={data} />}
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
}
