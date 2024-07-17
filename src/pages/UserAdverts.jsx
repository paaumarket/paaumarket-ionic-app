import AdvertList from "@/components/AdvertList";
import api from "@/lib/api";
import {
  IonAvatar,
  IonBackButton,
  IonButtons,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import clsx from "clsx";
import { useRouteMatch } from "react-router-dom";

import DefaultUserImage from "@/assets/user-avatar.svg";
import { isPlatform } from "@ionic/react";
import InfiniteScroll from "@/components/InfiniteScroll";
import Refresher from "@/components/Refresher";
import withIonPageQueryRefetch from "@/hoc/withIonPageQueryRefetch";
import { useApiInfiniteQuery, useApiQuery } from "@/hooks/useApiQuery";

export default withIonPageQueryRefetch(({ backButtonHref }) => {
  const match = useRouteMatch();

  const {
    isPending,
    isSuccess,
    data: user,
  } = useApiQuery({
    queryKey: ["user", match.params.user],
    queryFn: ({ signal }) =>
      api
        .get(`/users/${match.params.user}`, { signal })
        .then((response) => response.data),
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref={backButtonHref || "/app/adverts"} />
          </IonButtons>

          <IonTitle>
            {isSuccess ? (
              <IonAvatar
                className={clsx(
                  "w-8 h-8",
                  "inline-block align-middle",
                  "ion-margin-end",
                  isPlatform("ios") ? "ion-margin-start" : ""
                )}
              >
                <img
                  alt={user["name"]}
                  src={
                    user["profile_photo"]?.["cache"]?.["extra-small"] ||
                    DefaultUserImage
                  }
                  className="object-cover object-center w-full h-full"
                />
              </IonAvatar>
            ) : null}
            {isPending ? "Loading..." : user["name"]}
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding-top ion-padding-bottom">
        {isSuccess ? (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col items-center justify-center gap-4">
              <IonAvatar className="w-32 h-32">
                <img
                  src={
                    user["profile_photo"]?.["cache"]?.["medium"] ||
                    DefaultUserImage
                  }
                  alt={user["name"]}
                  className="object-cover object-center w-full h-full"
                />
              </IonAvatar>
              <h3 className="text-lg font-bold text-center ion-no-margin">
                {user["name"]}
              </h3>
            </div>
            <IonGrid className="w-full">
              <IonRow className="ion-justify-content-center">
                <IonCol size="12" sizeLg="8" sizeXl="9">
                  <UserAdvertList user={user} />
                </IonCol>
              </IonRow>
            </IonGrid>
          </div>
        ) : null}
      </IonContent>
    </IonPage>
  );
});

const UserAdvertList = ({ user }) => {
  const {
    isPending,
    isSuccess,
    data,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
  } = useApiInfiniteQuery({
    queryKey: ["adverts", "user", user["id"]],
    initialPageParam: "",
    queryFn: ({ signal, pageParam }) =>
      api
        .get(`/adverts?user=${user["id"]}&cursor=${pageParam}`, {
          signal,
        })
        .then((response) => response.data),
    getNextPageParam: (lastPage) => lastPage["meta"]["next_cursor"],
  });

  return (
    <div className="flex flex-col gap-4">
      <Refresher refresh={refetch} />
      <AdvertList isPending={isPending} isSuccess={isSuccess} data={data} />
      <InfiniteScroll
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
        isFetchingNextPage={isFetchingNextPage}
      />
    </div>
  );
};
