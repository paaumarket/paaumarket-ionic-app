import api from "@/lib/api";
import {
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
  IonSegment,
  IonSegmentButton,
  IonSpinner,
  IonText,
  IonThumbnail,
  IonTitle,
  IonToolbar,
  useIonActionSheet,
  useIonModal,
} from "@ionic/react";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useMemo } from "react";
import AdvertDetails from "@/component/AdvertDetails";
import { ellipsisHorizontal, ellipsisVertical } from "ionicons/icons";
import useDeleteAlert from "@/hooks/useDeleteAlert";
import EditAdvertFormModal from "@/component/EditAdvertFormModal";
import InfiniteScroll from "@/component/InfiniteScroll";

const MyAdverts = () => {
  const [segment, setSegment] = useState("all");
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
    queryKey: ["my-adverts", "approval", segment],
    getNextPageParam: (lastPage) => lastPage["meta"]["next_cursor"],
    queryFn: ({ signal, pageParam }) =>
      api
        .get(`/my-adverts?approval=${segment}&cursor=${pageParam}`, {
          signal,
        })
        .then((response) => response.data),
  });

  const adverts = useMemo(
    () => data?.pages.reduce((current, page) => current.concat(page.data), []),
    [data]
  );

  const handleEdited = () => refetch();
  const handleDeleted = () => refetch();

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
                onEdit={handleEdited}
                onDelete={handleDeleted}
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

const MyAdvertItem = ({ advert, onEdit, onDelete }) => {
  // Show Advert
  const [present, dismiss] = useIonModal(MyAdvertModal, {
    advert,
    onCancelled() {
      dismiss();
    },
  });

  const openAdvertModal = () => present();

  // Edit Advert
  const [presentEditAdvertModal, dismissEditAdvertModal] = useIonModal(
    EditAdvertFormModal,
    {
      advert,
      onCancelled: () => dismissEditAdvertModal(),
      onSuccess: (advert) => {
        dismissEditAdvertModal();
        onEdit(advert);
      },
    }
  );

  // Delete Alert
  const deleteMutation = useAdvertDeleteMutation(advert["id"]);
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
            presentEditAdvertModal();
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
        <img src={advert["images_preview"][0]?.["image"]["src"]} />
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
