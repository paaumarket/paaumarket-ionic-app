import DefaultUserImage from "@/assets/user-avatar.svg";
import InfiniteScroll from "@/components/InfiniteScroll";
import Refresher from "@/components/Refresher";
import api from "@/lib/api";
import {
  IonAvatar,
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonPage,
  IonSegment,
  IonSegmentButton,
  IonSpinner,
  IonTitle,
  IonToolbar,
  useIonModal,
  useIonToast,
} from "@ionic/react";
import { eyeOutline } from "ionicons/icons";
import { formatDate } from "date-fns";
import { useMemo } from "react";
import { useState } from "react";

import AdminDemandModal from "./AdminDemandModal";
import withIonPageQueryRefetch from "@/hoc/withIonPageQueryRefetch";
import { useApiInfiniteQuery } from "@/hooks/useApiQuery";

const AdminDemands = () => {
  const [segment, setSegment] = useState("reviewing");

  const {
    isPending,
    isSuccess,
    data,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
  } = useApiInfiniteQuery({
    initialPageParam: "",
    queryKey: ["demands", "approval", segment],
    getNextPageParam: (lastPage) => lastPage["meta"]["next_cursor"],
    queryFn: ({ signal, pageParam }) =>
      api
        .get(`/demands?approval=${segment}&cursor=${pageParam}`, { signal })
        .then((response) => response.data),
  });

  const demands = useMemo(
    () => data?.pages.reduce((current, page) => current.concat(page.data), []),
    [data]
  );

  const handleApproved = () => refetch();
  const handleDeclined = () => refetch();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/app/me/admin" />
          </IonButtons>
          <IonTitle>Demands</IonTitle>
        </IonToolbar>
        <IonToolbar>
          <IonSegment
            scrollable
            value={segment}
            onIonChange={(ev) => setSegment(ev.detail.value)}
          >
            <IonSegmentButton value="all">
              <IonLabel>All</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="reviewing">
              <IonLabel>Pending</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="approved">
              <IonLabel>Approved</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="declined">
              <IonLabel>Declined</IonLabel>
            </IonSegmentButton>
          </IonSegment>
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
            {demands.map((demand) => (
              <AdminDemandItem
                key={demand["id"]}
                demand={demand}
                onApproved={handleApproved}
                onDeclined={handleDeclined}
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

const AdminDemandItem = ({ demand, onApproved, onDeclined }) => {
  const [presentToast] = useIonToast();
  const [present, dismiss] = useIonModal(AdminDemandModal, {
    demand,
    onCancelled: () => dismiss(),
    onApproved() {
      presentToast({
        message: "Successfully Approved.",
        color: "success",
        duration: 2000,
      });
      dismiss();
      onApproved(demand);
    },
    onDeclined(demand) {
      presentToast({
        message: "Demand Declined.",
        color: "danger",
        duration: 2000,
      });
      dismiss();
      onDeclined(demand);
    },
  });

  const openDemandModal = () => present();

  return (
    <IonItem
      key={demand["id"]}
      onClick={() => openDemandModal()}
      className="ion-align-items-start"
    >
      <IonAvatar className="w-9 h-9" slot="start">
        <img
          src={
            demand["user_profile_photo"]?.["cache"]?.["extra-small"] ||
            DefaultUserImage
          }
          className="object-cover object-center w-full h-full"
        />
      </IonAvatar>

      <IonLabel>
        <h3 style={{ fontWeight: "bold" }}>{demand["title"]}</h3>
        <p>{demand["description"] || "(No description)"}</p>
        <p>
          <IonNote color={"tertiary"}>{demand["user_name"]}</IonNote>
        </p>
        <IonNote
          className="text-xs"
          color={
            demand["status"] === "approved"
              ? "success"
              : demand["status"] === "declined"
              ? "danger"
              : "warning"
          }
        >
          {demand["status"].toUpperCase()}
        </IonNote>{" "}
        <IonNote className="text-xs">
          {formatDate(demand["created_at"], "PPp")}
        </IonNote>{" "}
        -{" "}
        <IonNote className="text-xs" color={"tertiary"}>
          <IonIcon icon={eyeOutline} /> {demand["views_count"]}
        </IonNote>
      </IonLabel>
    </IonItem>
  );
};

export default withIonPageQueryRefetch(AdminDemands);
