import InfiniteScroll from "@/components/InfiniteScroll";
import Refresher from "@/components/Refresher";
import api from "@/lib/api";
import clsx from "clsx";
import {
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
  IonThumbnail,
  IonTitle,
  IonToolbar,
  useIonModal,
  useIonToast,
} from "@ionic/react";
import { eyeOutline } from "ionicons/icons";
import { formatDate } from "date-fns";
import { useMemo } from "react";
import { useState } from "react";

import AdminAdvertModal from "./AdminAdvertModal";
import withIonPageQueryRefetch from "@/hoc/withIonPageQueryRefetch";
import { useApiInfiniteQuery } from "@/hooks/useApiQuery";

const AdminAdverts = () => {
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
    queryKey: ["adverts", "approval", segment],
    getNextPageParam: (lastPage) => lastPage["meta"]["next_cursor"],
    queryFn: ({ signal, pageParam }) =>
      api
        .get(`/adverts?approval=${segment}&cursor=${pageParam}`, { signal })
        .then((response) => response.data),
  });

  const adverts = useMemo(
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
          <IonTitle>Adverts</IonTitle>
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
            {adverts.map((advert) => (
              <AdminAdvertItem
                key={advert["id"]}
                advert={advert}
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

const AdminAdvertItem = ({ advert, onApproved, onDeclined }) => {
  const [presentToast] = useIonToast();
  const [present, dismiss] = useIonModal(AdminAdvertModal, {
    advert,
    onCancelled: () => dismiss(),
    onApproved() {
      presentToast({
        message: "Successfully Approved.",
        color: "success",
        duration: 2000,
      });
      dismiss();
      onApproved(advert);
    },
    onDeclined(advert) {
      presentToast({
        message: "Advert Declined.",
        color: "danger",
        duration: 2000,
      });
      dismiss();
      onDeclined(advert);
    },
  });

  const openAdvertModal = () => present();

  return (
    <IonItem key={advert["id"]} onClick={() => openAdvertModal()}>
      <IonThumbnail
        slot="start"
        className="[--size:theme(spacing.20)] relative"
      >
        <img
          src={advert["images"][0]?.["image"]?.["cache"]?.["small"]}
          className="object-cover object-center w-full h-full"
        />
        <span
          className={clsx(
            "absolute",
            "bottom-0 right-0",
            "bg-[var(--ion-color-tertiary)]",
            "text-[var(--ion-color-tertiary-contrast)]",
            "text-xs",
            "p-1 rounded-tl",
            "font-bold",
            "leading-none"
          )}
        >
          {advert["images"].length}
        </span>
      </IonThumbnail>
      <IonLabel>
        <h4>{advert["title"]}</h4>
        <p>₦{Intl.NumberFormat().format(advert["price"])}</p>
        <p>
          <IonNote
            className="text-xs"
            color={
              advert["status"] === "approved"
                ? "success"
                : advert["status"] === "declined"
                ? "danger"
                : "warning"
            }
          >
            {advert["status"].toUpperCase()}
          </IonNote>{" "}
          <IonNote className="text-xs">
            {formatDate(advert["created_at"], "PPp")}
          </IonNote>{" "}
          -{" "}
          <IonNote className="text-xs" color={"tertiary"}>
            <IonIcon icon={eyeOutline} /> {advert["views_count"]}
          </IonNote>
        </p>
      </IonLabel>
    </IonItem>
  );
};

export default withIonPageQueryRefetch(AdminAdverts);
