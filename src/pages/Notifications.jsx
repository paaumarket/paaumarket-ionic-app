import Refresher from "@/components/Refresher";
import api from "@/lib/api";
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonPage,
  IonSpinner,
  IonThumbnail,
  IonTitle,
  IonToolbar,
  useIonLoading,
  useIonToast,
} from "@ionic/react";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { walletOutline } from "ionicons/icons";
import { useMemo } from "react";

const Notifications = () => {
  const {
    data,
    isPending,
    isSuccess,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    initialPageParam: "",
    queryKey: ["notifications"],
    queryFn: ({ signal, pageParam }) =>
      api
        .get(`/notifications?cursor=${pageParam}`, { signal })
        .then((response) => response.data),
    getNextPageParam: (lastPage) => lastPage["meta"]["next_cursor"],
  });

  const notifications = useMemo(
    () => data?.pages.reduce((current, page) => current.concat(page.data), []),
    [data]
  );

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home/profile" />
          </IonButtons>
          <IonTitle>Notifications</IonTitle>
        </IonToolbar>
      </IonHeader>

      {/* Page content */}
      <IonContent fullscreen>
        <Refresher refresh={refetch} />
        {isPending ? (
          <div className="ion-padding ion-text-center">
            <IonSpinner />
          </div>
        ) : null}

        {isSuccess ? (
          <IonList>
            {notifications.map((notification) => (
              <NotificationItem
                key={notification["id"]}
                notification={notification}
              />
            ))}
          </IonList>
        ) : null}
      </IonContent>
      {isSuccess && notifications.length ? (
        <IonFooter className="ion-padding">
          <NotificationsReadAllButton onSuccess={refetch} />
        </IonFooter>
      ) : null}
    </IonPage>
  );
};

const NotificationsReadAllButton = ({ onSuccess }) => {
  const [presentLoading, dismissLoading] = useIonLoading();
  const [presentToast] = useIonToast();
  const mutation = useMutation({
    mutationKey: ["notificiations", "read", "all"],
    mutationFn: () =>
      api.post("/notifications/read").then((response) => response.data),
    onSuccess() {
      presentToast({
        message: "Notifications Marked as read",
        color: "success",
        duration: 2000,
      });
    },
    onError(error) {
      presentToast({
        message:
          error?.response?.data?.message ||
          "Failed to mark notifications as read...",
        color: "danger",
        duration: 2000,
      });
    },
  });

  const readAllNotifications = () => {
    presentLoading()
      .then(() => mutation.mutateAsync(null, { onSuccess }))
      .finally(dismissLoading);
  };

  return (
    <IonButton
      expand="block"
      onClick={readAllNotifications}
      disabled={mutation.isPending}
    >
      Mark all as read
    </IonButton>
  );
};

const NotificationItem = ({ notification }) => {
  let content;

  switch (notification["type"]) {
    case "wallet_top_up_notification":
      content = (
        <IonItem color={!notification["read_at"] ? "light" : undefined}>
          <IonIcon slot="start" icon={walletOutline} />
          <IonLabel color={"success"}>
            <h4>Wallet Top Up</h4>
            <p> {notification["data"]["reference"]}</p>
          </IonLabel>
          <IonNote slot="end" color={"success"}>
            +₦{Intl.NumberFormat().format(notification["data"]["amount"])}
          </IonNote>
        </IonItem>
      );
      break;

    case "advert_approved_notification":
    case "advert_declined_notification":
      content = (
        <IonItem
          color={!notification["read_at"] ? "light" : undefined}
          routerLink={"/home/adverts/ad/" + notification["data"]["advert_id"]}
        >
          <IonThumbnail
            slot="start"
            className="[--size:theme(spacing.10)] relative"
          >
            <img
              src={notification["data"]["advert_image"]["cache"]["small"]}
              className="object-cover object-center w-full h-full"
            />
          </IonThumbnail>
          <IonLabel
            color={
              notification["type"] === "advert_approved_notification"
                ? "success"
                : "danger"
            }
          >
            Your advert <b>{notification["data"]["advert_title"]}</b> was{" "}
            {notification["type"] === "advert_approved_notification"
              ? "approved"
              : "declined"}
            !
          </IonLabel>
        </IonItem>
      );
      break;
  }

  return content;
};

export default Notifications;
