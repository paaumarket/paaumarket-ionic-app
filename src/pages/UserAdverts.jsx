import AdvertList from "@/component/AdvertList";
import api from "@/lib/api";
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonPage,
  IonThumbnail,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { useRouteMatch } from "react-router-dom";

import DefaultUserImage from "@/assets/user@100.png";

export default () => {
  const match = useRouteMatch();

  const queryKey = ["user", match.params.user];

  const {
    isPending,
    isSuccess,
    data: user,
  } = useQuery({
    queryKey,
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
            <IonBackButton defaultHref={"/home/adverts"} />
          </IonButtons>

          <IonTitle>
            {isPending ? "Loading..." : user["name"]}
            {isSuccess ? (
              <IonThumbnail
                className={clsx(
                  "[--size:theme(spacing.9)]",
                  "inline-block align-middle",
                  "ion-margin-start"
                )}
              >
                <img
                  alt={user["name"]}
                  src={user["profile_photo"]?.["src"] || DefaultUserImage}
                />
              </IonThumbnail>
            ) : null}
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
  const queryKey = ["adverts", "user", user["id"]];

  const { isPending, isSuccess, data, fetchNextPage } = useInfiniteQuery({
    queryKey,
    initialPageParam: "",
    queryFn: ({ signal, pageParam }) =>
      api
        .get(`/adverts?user=${user["id"]}&cursor=${pageParam}`, {
          signal,
        })
        .then((response) => response.data),
    getNextPageParam: (lastPage) => lastPage["next_cursor"],
  });

  return (
    <>
      <div className="ion-padding">
        <h3 className="font-bold ion-text-center">
          Adverts from {user["name"]}
        </h3>
      </div>
      <AdvertList isPending={isPending} isSuccess={isSuccess} data={data} />
      <IonInfiniteScroll
        onIonInfinite={(ev) => fetchNextPage().finally(ev.target.complete())}
      >
        <IonInfiniteScrollContent></IonInfiniteScrollContent>
      </IonInfiniteScroll>
    </>
  );
};
