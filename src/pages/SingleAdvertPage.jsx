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
  useIonLoading,
} from "@ionic/react";
import Header from "../component/Header";
import { useParams, useLocation } from "react-router-dom";
import api from "@/lib/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import Advert, { AdvertPlaceholder } from "@/component/Advert";
import { callOutline, logoWhatsapp, warningOutline } from "ionicons/icons";
import useAuth from "@/hooks/useAuth";
import { Link } from "react-router-dom";

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
        <div>{isSuccess ? <AdvertContact advert={advert} /> : null}</div>
      </IonContent>
    </IonPage>
  );
}

const AdvertContact = ({ advert }) => {
  const location = useLocation();
  const { user } = useAuth();
  const { data, mutateAsync, isSuccess } = useMutation({
    mutationKey: ["advert", advert["id"], "contact"],
    mutationFn: () =>
      api
        .post(`/adverts/${advert["id"]}/contact`)
        .then((response) => response.data),
  });

  const [presentLoading, dismissLoading] = useIonLoading();

  const handleShowContact = () => {
    presentLoading({
      message: "Fetching contact...",
    })
      /** Mutate */
      .then(() => mutateAsync(null))

      /** Dismiss Loading */
      .finally(() => dismissLoading());
  };

  return (
    <div>
      <IonText>
        <h4>
          <strong>Contact</strong>
        </h4>
      </IonText>

      {!user ? (
        <p>
          You need to sign in first to see contact:{" "}
          <Link to={`/login?return=${location.pathname}`}>Login</Link>
        </p>
      ) : isSuccess ? (
        <>
          <h2>{data["mobile_number"]}</h2>
          <IonButton
            className="ion-margin-top"
            expand="full"
            shape="round"
            fill="solid"
            color="primary"
            href={`tel:${data["mobile_number"]}`}
          >
            <IonIcon icon={callOutline} className="ion-padding-end"></IonIcon>
            Call
          </IonButton>
          <IonButton
            expand="full"
            shape="round"
            className="ion-margin-top"
            fill="outline"
            href={`https://wa.me/${
              data["mobile_number"]
            }?text=${encodeURIComponent(
              `Hi, I'm interested in your advert - ${
                advert["title"]
              } - ₦${Intl.NumberFormat().format(advert["price"])}`
            )}`}
            target="_blank"
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
      ) : (
        <IonButton
          className="ion-margin-top"
          expand="full"
          shape="round"
          fill="solid"
          color="primary"
          onClick={handleShowContact}
        >
          <IonIcon icon={callOutline} className="ion-padding-end"></IonIcon>
          Show Contact
        </IonButton>
      )}
    </div>
  );
};
