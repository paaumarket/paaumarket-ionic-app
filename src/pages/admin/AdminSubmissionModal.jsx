import api from "@/lib/api";
import DefaultUserImage from "@/assets/user-avatar.svg";
import {
  IonAvatar,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonItemGroup,
  IonLabel,
  IonList,
  IonListHeader,
  IonNote,
  IonPage,
  IonThumbnail,
  IonTitle,
  IonToolbar,
  useIonLoading,
} from "@ionic/react";
import { useMutation } from "@tanstack/react-query";
import { formatDate } from "date-fns";
import clsx from "clsx";

const AdminSubmissionModal = ({
  submission,
  onCancelled,
  onApproved,
  onDeclined,
}) => {
  const [presentLoading, dismissLoading] = useIonLoading();

  const approveMutation = useMutation({
    mutationKey: ["submission", submission["id"], "approve"],
    mutationFn: () =>
      api
        .post(`/submissions/${submission["id"]}/approve`)
        .then((response) => response.data),
  });

  const approveSubmission = () =>
    /** Show Loading */
    presentLoading({
      message: "Approving...",
    })
      /** Mutate */
      .then(() => approveMutation.mutateAsync(null, { onSuccess: onApproved }))

      /** Dismiss Loading */
      .finally(() => dismissLoading());

  const declineMutation = useMutation({
    mutationKey: ["submission", submission["id"], "decline"],
    mutationFn: () =>
      api
        .post(`/submissions/${submission["id"]}/decline`)
        .then((response) => response.data),
  });

  const declineSubmission = () =>
    /** Show Loading */
    presentLoading({
      message: "Declining...",
    })
      /** Mutate */
      .then(() => declineMutation.mutateAsync(null, { onSuccess: onDeclined }))

      /** Dismiss Loading */
      .finally(() => dismissLoading());
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={() => onCancelled()}>Cancel</IonButton>
          </IonButtons>
          <IonTitle>{submission["title"]}</IonTitle>
        </IonToolbar>
      </IonHeader>

      {/* Content */}
      <IonContent fullscreen>
        {/* Demand */}
        <IonList>
          <IonListHeader>
            <IonLabel>Demand</IonLabel>
          </IonListHeader>
          <IonItemGroup>
            <IonItem>
              <IonAvatar className="w-9 h-9 ion-align-self-start" slot="start">
                <img
                  src={
                    submission["demand_user_profile_photo"]?.["cache"]?.[
                      "extra-small"
                    ] || DefaultUserImage
                  }
                  className="object-cover object-center w-full h-full"
                />
              </IonAvatar>

              <IonLabel>
                <h3 style={{ fontWeight: "bold" }}>
                  {submission["demand_title"]}
                </h3>
                <p>{submission["demand_description"] || "(No description)"}</p>
                <p>
                  <IonNote color={"tertiary"}>
                    {submission["demand_user_name"]}
                  </IonNote>
                </p>
                <p>
                  <IonNote className="text-xs">
                    {formatDate(submission["demand_created_at"], "PPp")}
                  </IonNote>{" "}
                </p>
              </IonLabel>
            </IonItem>
          </IonItemGroup>
        </IonList>

        {/* Submission */}
        <IonList>
          <IonListHeader>
            <IonLabel>Submission</IonLabel>
          </IonListHeader>
          <IonItemGroup>
            <IonItem>
              <IonThumbnail
                slot="start"
                className="[--size:theme(spacing.32)] relative ion-align-self-start"
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
                {submission["advert_price"] ? (
                  <IonNote color={"primary"}>
                    ₦{Intl.NumberFormat().format(submission["advert_price"])}
                  </IonNote>
                ) : null}
                <h3
                  style={{ fontWeight: "bold" }}
                  className="flex flex-wrap items-center gap-2"
                >
                  {submission["advert_title"]}
                </h3>
                <p className="flex flex-wrap items-center gap-2">
                  <IonAvatar className="inline-block w-5 h-5">
                    <img
                      src={
                        submission["submission_user_profile_photo"]?.[
                          "cache"
                        ]?.["extra-small"] || DefaultUserImage
                      }
                      className="object-cover object-center w-full h-full"
                    />
                  </IonAvatar>{" "}
                  <IonNote color={"tertiary"}>
                    {submission["submission_user_name"]}
                  </IonNote>
                </p>
                <p>
                  <IonNote className="text-xs">
                    {formatDate(submission["advert_created_at"], "PPp")}
                  </IonNote>{" "}
                </p>
              </IonLabel>
            </IonItem>
          </IonItemGroup>
        </IonList>

        {/* Buttons */}
        <div className="ion-margin">
          <IonButton
            expand="block"
            color={"success"}
            onClick={approveSubmission}
          >
            Approve
          </IonButton>
        </div>

        <div className="ion-margin">
          <IonButton
            expand="block"
            color={"danger"}
            onClick={declineSubmission}
          >
            Decline
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default AdminSubmissionModal;
