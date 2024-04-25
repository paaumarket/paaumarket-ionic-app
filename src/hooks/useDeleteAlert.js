import { useIonAlert, useIonLoading, useIonToast } from "@ionic/react";

export default function useDeleteAlert({
  title = "",
  message = "",
  onDelete,
  onSuccess,
}) {
  const [presentToast, dismissToast] = useIonToast();
  const [presentAlert, dismissAlert] = useIonAlert();
  const [presentLoading, dismissLoading] = useIonLoading();

  return () =>
    presentAlert({
      header: "Delete",
      subHeader: title,
      message: message || "Are you sure you want to delete this item?",
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
        },
        {
          text: "OK",
          role: "confirm",
          handler: () => {
            presentLoading("Deleting....")
              .then(onDelete)
              .then(() => {
                presentToast({
                  message: "Successfully deleted.",
                  color: "success",
                  duration: 2000,
                });
              })
              .then(onSuccess)
              .catch(() =>
                presentToast({
                  message: "Failed to delete...",
                  color: "danger",
                  duration: 2000,
                })
              )

              .finally(() => dismissLoading());
          },
        },
      ],
    });
}
