import { AdvertImages } from "@/component/Advert";
import api from "@/lib/api";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonText,
  IonThumbnail,
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
        <IonList>
          {/* User */}
          <IonItem>
            <IonLabel>
              <h4>User</h4>
              <p>{advert["user_name"]}</p>
            </IonLabel>
          </IonItem>

          {/* Title */}
          <IonItem>
            <IonLabel>
              <h4>Title</h4>
              <p>{advert["title"]}</p>
            </IonLabel>
          </IonItem>

          {/* Category */}
          <IonItem>
            <IonLabel>
              <h4>Category</h4>
              <p className="flex flex-wrap items-center gap-2">
                <IonThumbnail
                  slot="start"
                  className="[--size:theme(spacing.8)]"
                >
                  <img
                    alt={advert["category_name"]}
                    src={
                      advert["category_image"]
                        ? advert["category_image"]["src"]
                        : null
                    }
                  />
                </IonThumbnail>{" "}
                {advert["category_name"]}
              </p>
            </IonLabel>
          </IonItem>
          {/* Price */}
          <IonItem>
            <IonLabel>
              <h4>Price</h4>
              <p>₦{Intl.NumberFormat().format(advert["price"])}</p>
            </IonLabel>
          </IonItem>

          {/* Description */}
          <IonItem>
            <IonLabel>
              <h4>Description</h4>
              <p>{advert["description"]}</p>
            </IonLabel>
          </IonItem>

          {/* Images */}
          <IonItem>
            <IonLabel>
              <h4>Images</h4>
              <p>{advert["images"]["length"]}</p>
            </IonLabel>
          </IonItem>

          <IonItem>
            <AdvertImages advert={advert} />
          </IonItem>

          {/* Approval */}
          <IonItem>
            <IonLabel>
              <h4>Approval</h4>
              <IonText
                color={
                  advert["status"] === "approved"
                    ? "success"
                    : advert["status"] === "declined"
                    ? "danger"
                    : "warning"
                }
              >
                <p>{advert["status"].toUpperCase()}</p>
              </IonText>
            </IonLabel>
          </IonItem>
        </IonList>

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
