import AdvertForm from "@/component/AdvertForm";
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

const AdminAdvertModal = ({ advert, onCancelled, onApproved, onDeclined }) => {
  const [presentLoading, dismissLoading] = useIonLoading();

  const declineMutation = useMutation({
    mutationKey: ["advert", advert["id"], "decline"],
    mutationFn: () =>
      api
        .post(`/adverts/${advert["id"]}/decline`)
        .then((response) => response.data),
  });

  const declineAdvert = () => {
    /** Show Loading */
    presentLoading({
      message: "Declining...",
    })
      /** Mutate */
      .then(() => declineMutation.mutateAsync(null, { onSuccess: onDeclined }))

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
        <AdvertForm isApproving advert={advert} onSuccess={onApproved} />

        <div className="ion-margin">
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
