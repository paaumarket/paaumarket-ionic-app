import InfiniteScroll from "@/components/InfiniteScroll";
import Refresher from "@/components/Refresher";
import useAuth from "@/hooks/useAuth";
import api from "@/lib/api";
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
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
  IonText,
  IonThumbnail,
  IonTitle,
  IonToolbar,
  useIonLoading,
  useIonToast,
} from "@ionic/react";
import { useMutation } from "@tanstack/react-query";
import { formatDate } from "date-fns";
import {
  checkmarkDoneCircleOutline,
  notificationsOutline,
  radioButtonOffOutline,
  telescopeOutline,
  walletOutline,
} from "ionicons/icons";
import { useMemo } from "react";
import Logo from "@/assets/paaumarket.svg";
import withIonPageQueryRefetch from "@/hoc/withIonPageQueryRefetch";
import { useApiInfiniteQuery } from "@/hooks/useApiQuery";

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
  } = useApiInfiniteQuery({
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
  let type, content;

  switch (notification["type"]) {
    case "system_notification":
      let props = {};
      let banner = notification["data"]["banner"];

      if (notification["data"]["link"]) {
        props.routerLink = notification["data"]["link"];
      }

      content = (
        <IonItem {...props} className="ion-align-items-start">
          <IonIcon slot="start" icon={notificationsOutline} />
          <IonLabel>
            {banner ? (
              <img
                src={banner["cache"]["medium"]}
                className="object-cover object-center w-full rounded-lg max-h-96"
              />
            ) : null}
            <p className="py-2">
              <IonText color={"tertiary"}>
                <b>[SYSTEM NOTIFICATION]</b>
              </IonText>{" "}
              <img src={Logo} className="w-4 h-4 align-middle" />{" "}
              {notification["data"]["message"]}
            </p>
            <NotificationDate notification={notification} />
          </IonLabel>
          <NotificationBadge notification={notification} />
        </IonItem>
      );
      break;

    case "wallet_top_up_notification":
      content = (
        <IonItem color={!notification["read_at"] ? "light" : undefined}>
          <IonIcon slot="start" icon={walletOutline} />
          <IonLabel color={"success"}>
            <h4>
              <b>[WALLET TOP UP]</b>
            </h4>
            <p>
              {" "}
              {notification["data"]["reference"] === "WELCOME_BALANCE"
                ? "Welcome Balance"
                : notification["data"]["reference"]}
            </p>
            <NotificationDate notification={notification} />
          </IonLabel>
          <IonNote slot="end" color={"success"}>
            +₦{Intl.NumberFormat().format(notification["data"]["amount"])}
          </IonNote>
          <NotificationBadge notification={notification} />
        </IonItem>
      );
      break;

    case "advert_approved_notification":
    case "advert_declined_notification":
      type =
        notification["type"] === "advert_approved_notification"
          ? "approved"
          : "declined";
      content = (
        <IonCard>
          <IonItem
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
            <IonLabel>
              <p>
                <IonText color={type === "approved" ? "success" : "danger"}>
                  <b>[DEMAND {type.toUpperCase()}]</b>
                </IonText>{" "}
                <b>{notification["data"]["advert_title"]}</b>
              </p>
              <NotificationDate notification={notification} />
            </IonLabel>
            <NotificationBadge notification={notification} />
          </IonItem>
        </IonCard>
      );
      break;

    case "demand_approved_notification":
    case "demand_declined_notification":
      type =
        notification["type"] === "demand_approved_notification"
          ? "approved"
          : "declined";
      content = (
        <IonItem
          routerLink={"/app/demands/" + notification["data"]["demand_id"]}
        >
          <IonIcon slot="start" icon={telescopeOutline} />

          <IonLabel
            color={
              notification["type"] === "demand_approved_notification"
                ? "success"
                : "danger"
            }
          >
            <p>
              <IonText color={type === "approved" ? "success" : "danger"}>
                <b>[DEMAND {type.toUpperCase()}]</b>
              </IonText>{" "}
              <b>{notification["data"]["demand_title"]}</b>
            </p>
            <NotificationDate notification={notification} />
          </IonLabel>
          <NotificationBadge notification={notification} />
        </IonItem>
      );
      break;

    case "submission_approved_notification":
    case "submission_declined_notification":
      type =
        notification["type"] === "submission_approved_notification"
          ? "approved"
          : "declined";

      content = (
        <IonItem
          routerLink={"/app/demands/" + notification["data"]["demand_id"]}
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
          <IonLabel>
            <p>
              <IonText color={type === "approved" ? "success" : "danger"}>
                <b>[SUBMISSION {type.toUpperCase()}]</b>
              </IonText>{" "}
              <b>{notification["data"]["advert_title"]}</b> {type} for{" "}
              <b>{notification["data"]["demand_title"]}</b>!
            </p>
            <NotificationDate notification={notification} />
          </IonLabel>

          <NotificationBadge notification={notification} />
        </IonItem>
      );
      break;

    case "new_submission_notification":
      content = (
        <IonItem
          routerLink={"/app/demands/" + notification["data"]["demand_id"]}
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
          <IonLabel>
            <p>
              <IonText color={"success"}>
                <b>[NEW SUBMISSION]</b>
              </IonText>{" "}
              <b>{notification["data"]["advert_title"]}</b> for{" "}
              <b>{notification["data"]["demand_title"]}</b>
            </p>
            <NotificationDate notification={notification} />
          </IonLabel>

          <NotificationBadge notification={notification} />
        </IonItem>
      );
      break;
  }

  return content;
};

const NotificationDate = ({ notification }) => {
  return (
    <p>
      <IonNote className="text-xs">
        {formatDate(notification["created_at"], "PPp")}
      </IonNote>
    </p>
  );
};

const NotificationBadge = ({ notification }) => {
  return (
    <IonIcon
      slot="end"
      icon={
        notification["read_at"]
          ? checkmarkDoneCircleOutline
          : radioButtonOffOutline
      }
      color={notification["read_at"] ? "success" : undefined}
    ></IonIcon>
  );
};

export default withIonPageQueryRefetch(Notifications);
