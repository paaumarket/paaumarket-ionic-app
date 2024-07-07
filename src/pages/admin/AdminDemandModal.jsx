import DemandForm from "@/components/DemandForm";
import DefaultUserImage from "@/assets/user-avatar.svg";
import api from "@/lib/api";
import clsx from "clsx";
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

const AdminDemandModal = ({ demand, onCancelled, onApproved, onDeclined }) => {
  const [presentAlert, dismissAlert] = useIonAlert();
  const [presentLoading, dismissLoading] = useIonLoading();

  const declineMutation = useMutation({
    mutationKey: ["demand", demand["id"], "decline"],
    mutationFn: () =>
      api
        .post(`/demands/${demand["id"]}/decline`)
        .then((response) => response.data),
  });

  const showDeclineAlert = () =>
    presentAlert({
      header: "Decline Demand",
      subHeader: demand["title"],
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
          handler: (input) => declineDemand(),
        },
      ],
    });

  const declineDemand = () =>
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
          <IonTitle>{demand["title"]}</IonTitle>
        </IonToolbar>
      </IonHeader>

      {/* Content */}
      <IonContent fullscreen>
        <div className="flex flex-wrap items-center gap-2 ion-margin">
          <IonAvatar className={clsx("w-5 h-5", "inline-block")}>
            <img
              alt={demand["user_name"]}
              src={
                demand["user_profile_photo"]?.["cache"]?.["extra-small"] ||
                DefaultUserImage
              }
              className="object-cover object-center w-full h-full"
            />
          </IonAvatar>{" "}
          {demand["user_name"]}
        </div>

        <DemandForm isReviewing demand={demand} onSuccess={onApproved} />

        <div className="ion-margin">
          <IonButton expand="block" color={"danger"} onClick={showDeclineAlert}>
            Decline
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default AdminDemandModal;
