import EditDemandFormModal from "@/components/EditDemandFormModal";
import InfiniteScroll from "@/components/InfiniteScroll";
import Refresher from "@/components/Refresher";
import api from "@/lib/api";
import useDeleteAlert from "@/hooks/useDeleteAlert";
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
  IonNote,
  IonPage,
  IonSegment,
  IonSegmentButton,
  IonSpinner,
  IonTitle,
  IonToolbar,
  useIonActionSheet,
  useIonModal,
} from "@ionic/react";
import {
  ellipsisHorizontal,
  ellipsisVertical,
  eyeOutline,
} from "ionicons/icons";
import { formatDate } from "date-fns";
import { useHistory } from "react-router";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { useMemo } from "react";
import { useState } from "react";

const MyDemands = () => {
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
    queryKey: ["my-demands", "approval", segment],
    getNextPageParam: (lastPage) => lastPage["meta"]["next_cursor"],
    queryFn: ({ signal, pageParam }) =>
      api
        .get(`/my-demands?approval=${segment}&cursor=${pageParam}`, {
          signal,
        })
        .then((response) => response.data),
  });

  const demands = useMemo(
    () => data?.pages.reduce((current, page) => current.concat(page.data), []),
    [data]
  );

  const handleRenewed = () => refetch();
  const handleEdited = () => refetch();
  const handleDeleted = () => refetch();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/app/me" />
          </IonButtons>
          <IonTitle>My Demands</IonTitle>
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
        <Refresher refresh={refetch} />
        {isPending ? (
          <div className="ion-padding ion-text-center">
            <IonSpinner />
          </div>
        ) : null}
        {isSuccess ? (
          <IonList>
            {demands.map((demand) => (
              <MyDemandItem
                key={demand["id"]}
                demand={demand}
                onEdit={handleEdited}
                onDelete={handleDeleted}
                onRenewed={handleRenewed}
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

const MyDemandItem = ({ demand, onEdit, onDelete, onRenewed }) => {
  const history = useHistory();

  // Edit Demand
  const [presentEditDemandModal, dismissEditDemandModal] = useIonModal(
    EditDemandFormModal,
    {
      demand,
      onCancelled: () => dismissEditDemandModal(),
      onSuccess: (demand) => {
        dismissEditDemandModal();
        onEdit(demand);
      },
    }
  );

  // Delete Demand
  const deleteMutation = useDemandDeleteMutation(demand["id"]);
  const deleteDemand = useDeleteAlert({
    title: demand["title"],
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
            presentEditDemandModal();
          },
        },
        {
          text: "Delete",
          role: "destructive",
          data: {
            action: "delete",
          },
          handler: () => {
            deleteDemand();
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
    <IonItem
      button
      key={demand["id"]}
      onClick={() => history.push("/app/demands/item/" + demand["id"])}
    >
      <IonLabel>
        <h4>{demand["title"]}</h4>
        <p>{demand["description"] || "(No description)"}</p>
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
      <IonButton onClick={openActions}>
        <IonIcon ios={ellipsisHorizontal} md={ellipsisVertical}></IonIcon>
      </IonButton>
    </IonItem>
  );
};

const useDemandDeleteMutation = (demand) =>
  useMutation({
    mutationKey: ["demands", demand, "delete"],
    mutationFn: () =>
      api.delete(`/demands/${demand}`).then((response) => response.data),
  });

export default MyDemands;
