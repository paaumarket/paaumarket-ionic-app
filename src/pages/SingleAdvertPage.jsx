import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonGrid,
  IonIcon,
  IonPage,
  IonRow,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import Header from "../component/Header";
import { useParams } from "react-router";
import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import Advert, { AdvertPlaceholder } from "@/component/Advert";
import { callOutline, logoWhatsapp, warningOutline } from "ionicons/icons";

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
              {isPending ? (
                <AdvertPlaceholder />
              ) : (
                <Advert full advert={advert} />
              )}
            </IonCol>
          </IonRow>
        </IonGrid>
        <div>
          {isPending ? (
            <AdvertPlaceholder />
          ) : (
            <AdvertDescription advert={advert} />
          )}
        </div>
      </IonContent>
    </IonPage>
  );
}

const AdvertDescription = ({ advert }) => {
  return (
    <div>
      <IonText>
        <h4>
          <strong>Description</strong>
        </h4>
      </IonText>
      <p>
        <IonText>{advert["description"]}</IonText>
      </p>
      {/* Contact Request Buttons */}
      <>
        <IonButton
          className="ion-margin-top"
          expand="full"
          shape="round"
          fill="solid"
          color="primary"
        >
          <IonIcon icon={callOutline} className="ion-padding-end"></IonIcon>
          Request Call
        </IonButton>
        <IonButton
          expand="full"
          shape="round"
          className="ion-margin-top"
          fill="outline"
        >
          <IonIcon icon={logoWhatsapp} className="ion-padding-end"></IonIcon>
          WhatsApp Message
        </IonButton>

        <p className="p-2 mt-2 text-sm rounded-md dark:bg-slate-300 bg-slate-200 text-slate-700 ">
          <IonIcon
            color="warning"
            // className="ion-margin-end"
            icon={warningOutline}
          ></IonIcon>
          Do not pay in advance even for the delivery!
        </p>
      </>
    </div>
  );
};
