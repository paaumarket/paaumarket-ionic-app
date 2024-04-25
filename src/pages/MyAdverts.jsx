import api from "@/lib/api";
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
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
  useIonActionSheet,
  useIonModal,
} from "@ionic/react";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useState } from "react";
import { useMemo } from "react";
import AdvertDetails from "@/component/AdvertDetails";
import { ellipsisHorizontal, ellipsisVertical } from "ionicons/icons";
import useDeleteAlert from "@/hooks/useDeleteAlert";

const MyAdverts = () => {
  const [segment, setSegment] = useState("all");

  const queryClient = useQueryClient();
  const queryKey = ["my-adverts", "approval", segment];
  const { isPending, isSuccess, data, fetchNextPage } = useInfiniteQuery({
    initialPageParam: "",
    queryKey,
    getNextPageParam: (lastPage) => lastPage["meta"]["next_cursor"],
    queryFn: ({ signal, pageParam }) =>
      api
        .get(`/my-adverts?approval=${segment}&cursor=${pageParam}`, { signal })
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

  const handleDeleted = () => {
    queryClient.refetchQueries({
      queryKey,
    });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home/profile" />
          </IonButtons>
          <IonTitle>My Adverts</IonTitle>
        </IonToolbar>
        <IonToolbar>
          <IonSegment
            value={segment}
            onIonChange={(ev) => setSegment(ev.detail.value)}
            scrollable
          >
            {/* All */}
            <IonSegmentButton value="all">
              <IonLabel>All</IonLabel>
            </IonSegmentButton>

            {/* Approved */}
            <IonSegmentButton value="approved">
              <IonLabel>Approved</IonLabel>
            </IonSegmentButton>

            {/* Reviewing */}
            <IonSegmentButton value="reviewing">
              <IonLabel>Reviewing</IonLabel>
            </IonSegmentButton>

            {/* Declined */}
            <IonSegmentButton value="declined">
              <IonLabel>Declined</IonLabel>
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
              <MyAdvertItem
                key={advert["id"]}
                advert={advert}
                onApproved={handleApproved}
                onDelete={handleDeleted}
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

const MyAdvertItem = ({ advert, onDelete }) => {
  const [present, dismiss] = useIonModal(MyAdvertModal, {
    advert,
    onCancelled() {
      dismiss();
    },
  });

  const openAdvertModal = () => present();

  const deleteMutation = useAdvertDeleteMutation(advert["id"]);

  // Delete Alert
  const deleteAlert = useDeleteAlert({
    title: advert["title"],
    onDelete: () => deleteMutation.mutateAsync(),
    onSuccess: onDelete,
  });

  // Action sheet
  const [presentActionSheet, dismissActionSheet] = useIonActionSheet();

  const openActions = (ev) => {
    ev.stopPropagation();

    presentActionSheet({
      buttons: [
        {
          text: "Edit",
          data: {
            action: "edit",
          },
          handler: () => {
            openEditSubCategoryModal();
          },
        },
        {
          text: "Delete",
          role: "destructive",
          data: {
            action: "delete",
          },
          handler: () => {
            deleteAlert();
          },
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
  };

  return (
    <IonItem key={advert["id"]} onClick={() => openAdvertModal(advert)}>
      <IonThumbnail slot="start" className="[--size:theme(spacing.20)]">
        <img src={advert["images"][0]["image"]["src"]} />
      </IonThumbnail>
      <IonLabel>
        <h4>{advert["title"]}</h4>
        <p>₦{Intl.NumberFormat().format(advert["price"])}</p>
        <IonNote
          color={
            advert["status"] === "approved"
              ? "success"
              : advert["status"] === "declined"
              ? "danger"
              : "warning"
          }
        >
          {advert["status"].toUpperCase()}
        </IonNote>
      </IonLabel>
      <IonButton onClick={openActions}>
        <IonIcon ios={ellipsisHorizontal} md={ellipsisVertical}></IonIcon>
      </IonButton>
    </IonItem>
  );
};

const MyAdvertModal = ({ advert, onCancelled }) => {
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
        <AdvertDetails advert={advert} />
      </IonContent>
    </IonPage>
  );
};

const useAdvertDeleteMutation = (advert) =>
  useMutation({
    mutationKey: ["adverts", advert, "delete"],
    mutationFn: () =>
      api.delete(`/adverts/${advert}`).then((response) => response.data),
  });

export default MyAdverts;
