import DefaultUserImage from "@/assets/user-avatar.svg";
import InfiniteScroll from "@/components/InfiniteScroll";
import Refresher from "@/components/Refresher";
import api from "@/lib/api";
import {
  IonAvatar,
  IonBackButton,
  IonBadge,
  IonButtons,
  IonContent,
  IonHeader,
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
import { formatDate } from "date-fns";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useState } from "react";

import clsx from "clsx";
import AdminSubmissionModal from "./AdminSubmissionModal";

const AdminSubmissions = () => {
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
    queryKey: ["submissions", "approval", segment],
    getNextPageParam: (lastPage) => lastPage["meta"]["next_cursor"],
    queryFn: ({ signal, pageParam }) =>
      api
        .get(`/submissions?approval=${segment}&cursor=${pageParam}`, { signal })
        .then((response) => response.data),
  });

  const submissions = useMemo(
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
          <IonTitle>Submissions</IonTitle>
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
            {submissions.map((submission) => (
              <AdminSubmissionItem
                key={submission["id"]}
                submission={submission}
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

const AdminSubmissionItem = ({ submission, onApproved, onDeclined }) => {
  const [presentToast] = useIonToast();
  const [present, dismiss] = useIonModal(AdminSubmissionModal, {
    submission,
    onCancelled: () => dismiss(),
    onApproved() {
      presentToast({
        message: "Successfully Approved.",
        color: "success",
        duration: 2000,
      });
      dismiss();
      onApproved(submission);
    },
    onDeclined(submission) {
      presentToast({
        message: "Submission Declined.",
        color: "danger",
        duration: 2000,
      });
      dismiss();
      onDeclined(submission);
    },
  });

  const openDemandModal = () => present();

  return (
    <IonItem
      key={submission["id"]}
      onClick={() => openDemandModal()}
      className="ion-align-items-start"
    >
      <IonThumbnail
        slot="start"
        className="[--size:theme(spacing.32)] relative"
      >
        <img
          alt={submission["advert_title"]}
          src={submission["advert_preview_image"]["cache"]["medium"]}
          width={submission["advert_preview_image"]["width"]}
          height={submission["advert_preview_image"]["height"]}
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
          {submission["advert_images_count"]}
        </span>
      </IonThumbnail>

      <IonLabel>
        {/* Demand */}
        <h3
          style={{ fontWeight: "bold" }}
          className="flex flex-wrap items-center gap-2"
        >
          <IonBadge color={"danger"}>B</IonBadge> {submission["demand_title"]}
        </h3>
        <p>{submission["demand_description"] || "(No description)"}</p>
        <p className="flex flex-wrap items-center gap-2">
          <IonAvatar className="inline-block w-5 h-5">
            <img
              src={
                submission["demand_user_profile_photo"]?.["cache"]?.[
                  "extra-small"
                ] || DefaultUserImage
              }
              className="object-cover object-center w-full h-full"
            />
          </IonAvatar>{" "}
          <IonNote color={"tertiary"}>{submission["demand_user_name"]}</IonNote>
        </p>
        {/* Divider */}
        <div className="py-2" />
        {/* Advert */}
        {submission["advert_price"] ? (
          <IonNote color={"primary"}>
            ₦{Intl.NumberFormat().format(submission["advert_price"])}
          </IonNote>
        ) : null}
        <h3
          style={{ fontWeight: "bold" }}
          className="flex flex-wrap items-center gap-2"
        >
          <IonBadge color={"success"}>S</IonBadge> {submission["advert_title"]}
        </h3>
        <p className="flex flex-wrap items-center gap-2">
          <IonAvatar className="inline-block w-5 h-5">
            <img
              src={
                submission["submission_user_profile_photo"]?.["cache"]?.[
                  "extra-small"
                ] || DefaultUserImage
              }
              className="object-cover object-center w-full h-full"
            />
          </IonAvatar>{" "}
          <IonNote color={"tertiary"}>
            {submission["submission_user_name"]}
          </IonNote>
        </p>
        {/* Status */}
        <IonNote
          className="text-xs"
          color={
            submission["status"] === "approved"
              ? "success"
              : submission["status"] === "declined"
              ? "danger"
              : "warning"
          }
        >
          {submission["status"].toUpperCase()}
        </IonNote>{" "}
        <IonNote className="text-xs">
          {formatDate(submission["created_at"], "PPp")}
        </IonNote>
      </IonLabel>
    </IonItem>
  );
};

export default AdminSubmissions;
