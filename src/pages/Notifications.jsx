import InfiniteScroll from "@/components/InfiniteScroll";
import Refresher from "@/components/Refresher";
import useAuth from "@/hooks/useAuth";
import api from "@/lib/api";
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCol,
  IonContent,
  IonFooter,
  IonGrid,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonNote,
  IonPage,
  IonRow,
  IonSpinner,
  IonThumbnail,
  IonTitle,
  IonToolbar,
  useIonLoading,
  useIonToast,
} from "@ionic/react";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { megaphone, walletOutline } from "ionicons/icons";
import { useMemo } from "react";

const Notifications = () => {
  const { user, login } = useAuth();
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

  const handleReadAllSuccess = () => {
    login({
      user: {
        ...user,
        unread_notifications_count: 0,
      },
    });
    refetch();
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/app/me" />
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
          <IonGrid>
            <IonRow className="ion-justify-content-center">
              <IonCol sizeLg="6">
                {notifications.map((notification) => (
                  <NotificationItem
                    key={notification["id"]}
                    notification={notification}
                  />
                ))}
              </IonCol>
            </IonRow>
          </IonGrid>
        ) : null}
      </IonContent>
      {isSuccess && notifications.length ? (
        <IonFooter className="ion-padding">
          <NotificationsReadAllButton onSuccess={handleReadAllSuccess} />
        </IonFooter>
      ) : null}

      <InfiniteScroll
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
        isFetchingNextPage={isFetchingNextPage}
      />
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
    case "system_notification":
      let props = {};
      let banner = notification["data"]["banner"];

      if (notification["data"]["link"]) {
        props.routerLink = notification["data"]["link"];
      }

      content = (
        <IonCard {...props}>
          {banner ? (
            <img
              src={banner["cache"]["medium"]}
              className="object-cover object-center w-full max-h-56"
            />
          ) : null}
          <IonCardHeader>
            <IonCardSubtitle color={"d"}>
              {formatDistanceToNow(notification["created_at"])}
            </IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent>
            {!notification["read_at"] ? (
              <IonIcon icon={megaphone} color="success" />
            ) : undefined}{" "}
            {notification["data"]["message"]}
          </IonCardContent>
        </IonCard>
      );
      break;

    case "wallet_top_up_notification":
      content = (
        <IonCard>
          <IonItem color={!notification["read_at"] ? "light" : undefined}>
            <IonIcon slot="start" icon={walletOutline} />
            <IonLabel color={"success"}>
              <h4>Wallet Top Up</h4>
              <p>
                {" "}
                {notification["data"]["reference"] === "WELCOME_BALANCE"
                  ? "Welcome Balance"
                  : notification["data"]["reference"]}
              </p>
              <p>{formatDistanceToNow(notification["created_at"])}</p>
            </IonLabel>
            <IonNote slot="end" color={"success"}>
              +₦{Intl.NumberFormat().format(notification["data"]["amount"])}
            </IonNote>
          </IonItem>
        </IonCard>
      );
      break;

    case "advert_approved_notification":
    case "advert_declined_notification":
      content = (
        <IonCard>
          <IonItem
            color={!notification["read_at"] ? "light" : undefined}
            routerLink={"/app/adverts/ad/" + notification["data"]["advert_id"]}
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
        </IonCard>
      );
      break;
  }

  return content;
};

export default Notifications;
