import api from "@/lib/api";
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonSegment,
  IonSegmentButton,
  IonSpinner,
  IonText,
  IonThumbnail,
  IonTitle,
  IonToolbar,
  useIonModal,
} from "@ionic/react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useMemo } from "react";
import AdminAdvertModal from "./AdminAdvertModal";
import InfiniteScroll from "@/component/InfiniteScroll";
import Refresher from "@/component/Refresher";
import clsx from "clsx";

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
  } = useInfiniteQuery({
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

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/admin" />
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

const AdminAdvertItem = ({ advert, onApproved }) => {
  const [present, dismiss] = useIonModal(AdminAdvertModal, {
    advert,
    onCancelled: () => dismiss(),
    onSuccess: (advert) => {
      dismiss();
      onApproved(advert);
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
            "bottom-0 right-1",
            "bg-[var(--ion-color-tertiary)]",
            "text-[var(--ion-color-tertiary-contrast)]",
            "text-xs",
            "p-1 rounded-t"
          )}
        >
          {advert["images"].length}
        </span>
      </IonThumbnail>
      <IonLabel>
        <h4>{advert["title"]}</h4>
        <p>₦{Intl.NumberFormat().format(advert["price"])}</p>
        <p>
          <IonText
            color={
              advert["status"] === "approved"
                ? "success"
                : advert["status"] === "declined"
                ? "danger"
                : "warning"
            }
          >
            {advert["status"].toUpperCase()}
          </IonText>
        </p>
      </IonLabel>
    </IonItem>
  );
};

export default AdminAdverts;
