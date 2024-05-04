import AdvertForm from "@/components/AdvertForm";
import api from "@/lib/api";
import {
  IonAvatar,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonAlert,
  useIonLoading,
} from "@ionic/react";
import { useMutation } from "@tanstack/react-query";

import DefaultUserImage from "@/assets/user@100.png";
import clsx from "clsx";

const AdminAdvertModal = ({ advert, onCancelled, onApproved, onDeclined }) => {
  const [presentAlert, dismissAlert] = useIonAlert();
  const [presentLoading, dismissLoading] = useIonLoading();

  const declineMutation = useMutation({
    mutationKey: ["advert", advert["id"], "decline"],
    mutationFn: () =>
      api
        .post(`/adverts/${advert["id"]}/decline`)
        .then((response) => response.data),
  });

  const showDeclineAlert = () =>
    presentAlert({
      header: "Decline Advert",
      subHeader: advert["title"],
      message: "Pick a reason for declining. (Under construction)",
      inputs: [
        {
          label: "Reason 1",
          type: "radio",
          value: "reason-1",
        },
        {
          label: "Reason 2",
          type: "radio",
          value: "reason-2",
        },
      ],

      buttons: [
        {
          text: "Cancel",
          role: "cancel",
        },
        {
          text: "OK",
          role: "confirm",
          handler: (input) => declineAdvert(),
        },
      ],
    });

  const declineAdvert = () =>
    /** Show Loading */
    presentLoading({
      message: "Declining...",
    })
      /** Mutate */
      .then(() => declineMutation.mutateAsync(null, { onSuccess: onDeclined }))

      /** Dismiss Loading */
      .finally(() => dismissLoading());
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
        <div className="flex flex-wrap items-center gap-2 ion-margin">
          <IonAvatar className={clsx("w-5 h-5", "inline-block")}>
            <img
              alt={advert["user_name"]}
              src={
                advert["user_profile_photo"]?.["cache"]?.["extra-small"] ||
                DefaultUserImage
              }
              className="object-cover object-center w-full h-full"
            />
          </IonAvatar>{" "}
          {advert["user_name"]}
        </div>

        <AdvertForm isApproving advert={advert} onSuccess={onApproved} />

        <div className="ion-margin">
          {advert["status"] === "reviewing" ? (
            <IonButton
              expand="block"
              color={"danger"}
              onClick={showDeclineAlert}
            >
              Decline
            </IonButton>
          ) : null}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default AdminAdvertModal;
