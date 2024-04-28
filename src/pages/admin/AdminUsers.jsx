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
  useIonToast,
} from "@ionic/react";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useMemo } from "react";
import DefaultUserImage from "@/assets/user@100.png";
import { Link } from "react-router-dom";
import { generatePath } from "react-router";
import { ellipsisHorizontal, ellipsisVertical } from "ionicons/icons";
import InfiniteScroll from "@/component/InfiniteScroll";
import Refresher from "@/component/Refresher";

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
            <IonBackButton defaultHref="/admin" />
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
      <IonAvatar slot="start" className="w-10 h-10]">
        <img
          src={
            user["profile_photo"]?.["cache"]?.["extra-small"] ||
            DefaultUserImage
          }
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
            to={generatePath("/admin/adverts/user/:id", {
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
