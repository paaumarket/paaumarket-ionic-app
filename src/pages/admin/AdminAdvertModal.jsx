import AdvertDetails from "@/component/AdvertDetails";
import api from "@/lib/api";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonLoading,
} from "@ionic/react";
import { useMutation } from "@tanstack/react-query";

const AdminAdvertModal = ({ advert, onCancelled, onSuccess }) => {
  const [presentLoading, dismissLoading] = useIonLoading();

  const approveMutation = useMutation({
    mutationKey: ["advert", advert["id"], "approve"],
    mutationFn: () =>
      api
        .post(`/adverts/${advert["id"]}/approve`)
        .then((response) => response.data),
  });

  const declineMutation = useMutation({
    mutationKey: ["advert", advert["id"], "decline"],
    mutationFn: () =>
      api
        .post(`/adverts/${advert["id"]}/decline`)
        .then((response) => response.data),
  });

  const approveAdvert = () => {
    /** Show Loading */
    presentLoading({
      message: "Approving...",
    })
      /** Mutate */
      .then(() => approveMutation.mutateAsync(null, { onSuccess }))

      /** Dismiss Loading */
      .finally(() => dismissLoading());
  };

  const declineAdvert = () => {
    /** Show Loading */
    presentLoading({
      message: "Declining...",
    })
      /** Mutate */
      .then(() => declineMutation.mutateAsync(null, { onSuccess }))

      /** Dismiss Loading */
      .finally(() => dismissLoading());
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={() => onCancelled()}>Cancel</IonButton>
          </IonButtons>
          <IonTitle>{advert["title"]}</IonTitle>
        </IonToolbar>
      </IonHeader>

      {/* Content */}
      <IonContent fullscreen>
        <AdvertDetails advert={advert} />

        <div className="ion-padding">
          {advert["status"] !== "approved" ? (
            <IonButton expand="block" color={"success"} onClick={approveAdvert}>
              Approve
            </IonButton>
          ) : null}

          {advert["status"] !== "declined" ? (
            <IonButton expand="block" color={"danger"} onClick={declineAdvert}>
              Decline
            </IonButton>
          ) : null}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default AdminAdvertModal;
