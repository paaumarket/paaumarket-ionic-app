import api from "@/lib/api";
import {
  IonAvatar,
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonSearchbar,
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar,
  useIonActionSheet,
  useIonAlert,
  useIonLoading,
  useIonModal,
  useIonToast,
} from "@ionic/react";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useMemo } from "react";
import DefaultUserImage from "@/assets/user-avatar.svg";
import { Link } from "react-router-dom";
import { generatePath } from "react-router";
import {
  callOutline,
  ellipsisHorizontal,
  ellipsisVertical,
  logoWhatsapp,
} from "ionicons/icons";
import InfiniteScroll from "@/components/InfiniteScroll";
import Refresher from "@/components/Refresher";
import clsx from "clsx";
import { format } from "date-fns";

const AdminUsers = () => {
  const [search, setSearch] = useState("");
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
    queryKey: search ? ["users", "list", search] : ["users", "list"],
    queryFn: ({ signal, pageParam }) =>
      api
        .get(
          `/users?cursor=${pageParam}${
            search ? `&search=${encodeURIComponent(search)}` : ""
          }`,
          { signal }
        )
        .then((response) => response.data),
    getNextPageParam: (lastPage) => lastPage["meta"]["next_cursor"],
  });

  const users = useMemo(
    () => data?.pages.reduce((current, page) => current.concat(page.data), []),
    [data]
  );

  const handleTopUp = () => refetch();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/app/me/admin" />
          </IonButtons>
          <IonTitle>Users</IonTitle>
        </IonToolbar>
        <IonToolbar>
          <IonSearchbar
            debounce={500}
            onIonInput={(ev) => setSearch(ev.target.value)}
            showClearButton="always"
          />
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
            {users.map((user) => (
              <AdminUserItem
                key={user["id"]}
                user={user}
                onTopUp={handleTopUp}
              />
            ))}
          </IonList>
        ) : null}

        <InfiniteScroll
          hasNextPage={hasNextPage}
          fetchNextPage={fetchNextPage}
          isFetchingNextPage={isFetchingNextPage}
        />
      </IonContent>
    </IonPage>
  );
};

const AdminUserItem = ({ user, onTopUp }) => {
  const [presentModal, dismissModal] = useIonModal(AdminUserDetailsModal, {
    user,
    onDismissed: () => dismissModal(),
  });

  const openTopUpAlert = useTopUpAlert({
    user,
    onSuccess: onTopUp,
  });

  // Action sheet
  const [presentActionSheet, dismissActionSheet] = useIonActionSheet();

  const openActions = () =>
    presentActionSheet({
      buttons: [
        {
          text: "Show Details",
          data: {
            action: "show-details",
          },
          handler: () => presentModal(),
        },
        {
          text: "Top Up",
          data: {
            action: "top-up",
          },
          handler: openTopUpAlert,
        },
        {
          text: "Cancel",
          role: "cancel",
          data: {
            action: "cancel",
          },
        },
      ],
    });

  return (
    <IonItem key={user["id"]}>
      <IonAvatar slot="start" className="w-10 h-10">
        <img
          src={
            user["profile_photo"]?.["cache"]?.["extra-small"] ||
            DefaultUserImage
          }
          className="object-cover object-center w-full h-full"
        />
      </IonAvatar>
      <IonLabel>
        <h4>{user["name"]}</h4>
        <p>{user["email"]}</p>
        <p>
          <IonText
            slot="start"
            color={
              user["wallet_balance"] <= 100
                ? "danger"
                : user["wallet_balance"] < 1000
                ? "warning"
                : "success"
            }
          >
            ₦{Intl.NumberFormat().format(user["wallet_balance"])}
          </IonText>
        </p>
        <p>
          <Link
            to={generatePath("/app/me/admin/adverts/user/:id", {
              id: user["id"],
            })}
          >
            {user["adverts_count"]} ads
          </Link>
        </p>
      </IonLabel>
      <IonButton slot="end" onClick={openActions}>
        <IonIcon ios={ellipsisHorizontal} md={ellipsisVertical}></IonIcon>
      </IonButton>
    </IonItem>
  );
};

const AdminUserDetailsModal = ({ user, onDismissed }) => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={() => onDismissed()}>Cancel</IonButton>
          </IonButtons>
          <IonTitle>{user["name"]}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div className="ion-padding">
          <IonAvatar className={clsx("w-28 h-28", "inline-block")}>
            <img
              alt={user["name"]}
              src={
                user["profile_photo"]?.["cache"]?.["medium"] || DefaultUserImage
              }
              className="object-cover object-center w-full h-full"
            />
          </IonAvatar>
        </div>
        <IonList>
          {/* Name */}
          <IonItem>
            <IonLabel>
              <h3>Name</h3>
              <p>{user["name"]}</p>
            </IonLabel>
          </IonItem>

          {/* Email */}
          <IonItem>
            <IonLabel>
              <h3>Email</h3>
              <p>{user["email"]}</p>
            </IonLabel>
          </IonItem>

          {/* Mobile Number */}
          <IonItem>
            <IonLabel>
              <h3>Mobile Number</h3>
              <p>{user["mobile_number"]}</p>
            </IonLabel>
            <IonButtons slot="end">
              <IonButton
                color={"primary"}
                target="_blank"
                href={`tel:${user["mobile_number"]}`}
              >
                <IonIcon icon={callOutline} />
              </IonButton>
              <IonButton
                color={"primary"}
                target="_blank"
                href={`https://wa.me/234${user["mobile_number"]}`}
              >
                <IonIcon icon={logoWhatsapp} />
              </IonButton>
            </IonButtons>
          </IonItem>

          {/* Wallet Balance */}
          <IonItem>
            <IonLabel>
              <h3>Wallet Balance</h3>
              <p>
                <IonText
                  slot="start"
                  color={
                    user["wallet_balance"] <= 100
                      ? "danger"
                      : user["wallet_balance"] < 1000
                      ? "warning"
                      : "success"
                  }
                >
                  ₦{Intl.NumberFormat().format(user["wallet_balance"])}
                </IonText>
              </p>
            </IonLabel>
          </IonItem>

          {/* Adverts */}
          <IonItem>
            <IonLabel>
              <h3>Adverts</h3>
              <p>{user["adverts_count"]} ads</p>
            </IonLabel>
          </IonItem>

          {/* Registered Date */}
          <IonItem>
            <IonLabel>
              <h3>Registered</h3>
              <p>{format(user["created_at"], "PPp")}</p>
            </IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

/** Top Up Alert */
const useTopUpAlert = ({ user, onSuccess }) => {
  const [presentAlert, dismissAlert] = useIonAlert();
  const [presentToast, dismissToast] = useIonToast();
  const [presentLoading, dismissLoading] = useIonLoading();

  const topUpMutation = useTopUpMutation(user["id"], {
    onSuccess() {
      presentToast({
        message: "Successfully credited.",
        color: "success",
        duration: 2000,
      });
    },
    onError(error) {
      presentToast({
        message: error?.response?.data?.message || "Failed to credit wallet...",
        color: "danger",
        duration: 2000,
      });
    },
  });

  return () =>
    presentAlert({
      header: "Top Up",
      message: "Credit User Wallet",
      inputs: [
        {
          name: "amount",
          placeholder: "Amount",
          type: "number",
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
          handler: (input) =>
            presentLoading("Please Wait...")
              .then(() => topUpMutation.mutateAsync(input, { onSuccess }))
              .finally(() => dismissLoading()),
        },
      ],
    });
};

/** Top Up Mutation */
const useTopUpMutation = (user, options) =>
  useMutation({
    ...options,
    mutationKey: ["top-up", user],
    mutationFn: (data) =>
      api.put(`/users/${user}/top-up`, data).then((response) => response.data),
  });

export default AdminUsers;
