import api from "@/lib/api";
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonSegment,
  IonSegmentButton,
  IonSpinner,
  IonThumbnail,
  IonTitle,
  IonToolbar,
  useIonModal,
} from "@ionic/react";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useMemo } from "react";
import AdminAdvertModal from "./AdminAdvertModal";

const AdminAdverts = () => {
  const [segment, setSegment] = useState("pending");

  const queryClient = useQueryClient();
  const queryKey = ["adverts", "approval", segment];
  const { isPending, isSuccess, data, fetchNextPage } = useInfiniteQuery({
    initialPageParam: "",
    queryKey,
    getNextPageParam: (lastPage) => lastPage["meta"]["next_cursor"],
    queryFn: ({ signal, pageParam }) =>
      api
        .get(
          `/adverts?approval=${segment === "approved"}&cursor=${pageParam}`,
          { signal }
        )
        .then((response) => response.data),
  });

  const adverts = useMemo(
    () => data?.pages.reduce((current, page) => current.concat(page.data), []),
    [data]
  );

  const handleApproved = () => {
    queryClient.refetchQueries({
      queryKey,
    });
  };

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
            value={segment}
            onIonChange={(ev) => setSegment(ev.detail.value)}
          >
            <IonSegmentButton value="pending">
              <IonLabel>Pending</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="approved">
              <IonLabel>Approved</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </IonHeader>

      {/* Page content */}
      <IonContent fullscreen>
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

        <IonInfiniteScroll
          onIonInfinite={(ev) => fetchNextPage().finally(ev.target.complete())}
        >
          <IonInfiniteScrollContent></IonInfiniteScrollContent>
        </IonInfiniteScroll>
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

  const openAdvertModal = (advert) => present();

  return (
    <IonItem key={advert["id"]} onClick={() => openAdvertModal(advert)}>
      <IonThumbnail slot="start" className="[--size:theme(spacing.10)]">
        <img src={advert["images"][0]["image"]["src"]} />
      </IonThumbnail>
      <IonLabel>
        <h4>{advert["title"]}</h4>
        <p>₦{Intl.NumberFormat().format(advert["price"])}</p>
      </IonLabel>
    </IonItem>
  );
};

export default AdminAdverts;
