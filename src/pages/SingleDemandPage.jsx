import AdvertList from "@/components/AdvertList";
import DefaultUserImage from "@/assets/user-avatar.svg";
import InfiniteScroll from "@/components/InfiniteScroll";
import api from "@/lib/api";
import useAuth from "@/hooks/useAuth";
import { DemandPlaceholder } from "@/components/DemandList";
import {
  IonAvatar,
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonModal,
} from "@ionic/react";
import { eyeOutline } from "ionicons/icons";
import { formatDate } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import AdvertPicker from "@/components/AdvertPicker";
import withIonPageQueryRefetch from "@/hoc/withIonPageQueryRefetch";
import { useApiInfiniteQuery, useApiQuery } from "@/hooks/useApiQuery";

export default withIonPageQueryRefetch(function SingleDemandPage() {
  const { user } = useAuth();
  const { id } = useParams();
  const {
    isPending,
    isSuccess,
    data: demand,
  } = useApiQuery({
    queryKey: ["demand", id],
    queryFn: ({ signal }) =>
      api.get(`/demands/${id}`, { signal }).then((response) => response.data),
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/app/demands"></IonBackButton>
          </IonButtons>
          <IonTitle>
            {isPending ? "Loading..." : isSuccess ? demand["title"] : "Error!"}
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="ion-padding">
        <IonList>
          {isPending ? (
            <DemandPlaceholder />
          ) : isSuccess ? (
            <IonItem className="ion-align-items-start">
              <IonAvatar className="w-9 h-9" slot="start">
                <img
                  src={
                    demand["user"]["profile_photo"]?.["cache"]?.[
                      "extra-small"
                    ] || DefaultUserImage
                  }
                  className="object-cover object-center w-full h-full"
                />
              </IonAvatar>

              <IonLabel>
                <h3 style={{ fontWeight: "bold" }}>{demand["title"]}</h3>
                <p>{demand["description"] || "(No description)"}</p>
                <p>
                  <IonNote color={"tertiary"}>{demand["user"]["name"]}</IonNote>
                </p>
                <p>
                  <IonNote className="text-xs" color={"tertiary"}>
                    <IonIcon icon={eyeOutline} /> {demand["views_count"]}
                  </IonNote>{" "}
                  -{" "}
                  <IonNote className="text-xs">
                    {formatDate(demand["created_at"], "PPp")}
                  </IonNote>{" "}
                </p>
              </IonLabel>
            </IonItem>
          ) : (
            "Error..."
          )}
        </IonList>
        {isSuccess && demand["status"] === "approved" ? (
          <Submissions demand={demand} />
        ) : null}
      </IonContent>
      <IonFooter className="ion-padding">
        {isSuccess && user && user["id"] !== demand["user_id"] ? (
          <SubmissionButton demand={demand} />
        ) : null}
      </IonFooter>
    </IonPage>
  );
});

const SubmissionButton = ({ demand, onSuccess }) => {
  const queryClient = useQueryClient();
  const [presentModal, dismissModal] = useIonModal(AdvertPicker, {
    demand,
    onCancelled: () => dismissModal(),
    onSuccess: () => {
      dismissModal();
      queryClient.resetQueries({
        queryKey: ["demand", demand["id"], "submissions"],
      });
    },
  });

  return (
    <IonButton expand="block" onClick={presentModal}>
      Add Submission
    </IonButton>
  );
};

const Submissions = ({ demand }) => {
  const {
    data,
    isPending,
    isSuccess,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
  } = useApiInfiniteQuery({
    initialPageParam: "",
    queryKey: ["demand", demand["id"], "submissions"],
    queryFn: ({ signal, pageParam }) =>
      api
        .get(`/demands/${demand["id"]}/submissions?cursor=${pageParam}`, {
          signal,
        })
        .then((response) => response.data),
    getNextPageParam: (lastPage) => lastPage["meta"]["next_cursor"],
  });

  return (
    <>
      <AdvertList
        title={"Submissions"}
        isPending={isPending}
        isSuccess={isSuccess}
        data={data}
      />

      <InfiniteScroll
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
        isFetchingNextPage={isFetchingNextPage}
      />
    </>
  );
};
