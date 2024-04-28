import AdvertList from "@/component/AdvertList";
import api from "@/lib/api";
import {
  IonAvatar,
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { useRouteMatch } from "react-router-dom";

import DefaultUserImage from "@/assets/user@100.png";
import { isPlatform } from "@ionic/react";
import InfiniteScroll from "@/component/InfiniteScroll";
import Refresher from "@/component/Refresher";

export default ({ backButtonHref }) => {
  const match = useRouteMatch();

  const {
    isPending,
    isSuccess,
    data: user,
  } = useQuery({
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
            <IonBackButton defaultHref={backButtonHref || "/home/adverts"} />
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
                  src={user["profile_photo"]?.["src"] || DefaultUserImage}
                />
              </IonAvatar>
            ) : null}
            {isPending ? "Loading..." : user["name"]}
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {isSuccess ? <UserAdvertList user={user} /> : null}
      </IonContent>
    </IonPage>
  );
};

const UserAdvertList = ({ user }) => {
  const {
    isPending,
    isSuccess,
    data,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
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
    <>
      <div className="ion-padding">
        <h3 className="font-bold ion-text-center">
          Adverts from {user["name"]}
        </h3>
      </div>
      <Refresher refresh={refetch} />
      <AdvertList isPending={isPending} isSuccess={isSuccess} data={data} />
      <InfiniteScroll
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
        isFetchingNextPage={isFetchingNextPage}
      />
    </>
  );
};
