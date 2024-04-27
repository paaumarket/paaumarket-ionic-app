import Advert, { AdvertPlaceholder } from "@/component/Advert";
import api from "@/lib/api";
import {
  IonBackButton,
  IonButtons,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonPage,
  IonRow,
  IonThumbnail,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { useMemo } from "react";
import { generatePath, useRouteMatch } from "react-router-dom";

export default () => {
  const match = useRouteMatch();

  const queryKey = ["category", match.params.category, "sub", match.params.sub];

  const {
    isPending,
    isSuccess,
    data: category,
  } = useQuery({
    queryKey,
    queryFn: ({ signal }) =>
      api
        .get(`/categories/${match.params.sub}`, { signal })
        .then((response) => response.data),
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton
              defaultHref={generatePath("/home/adverts/categories/:category", {
                category: match.params.category,
              })}
            />
          </IonButtons>

          <IonTitle>
            {isPending ? "Loading..." : category["name"]}
            {isSuccess ? (
              <IonThumbnail
                className={clsx(
                  "[--size:theme(spacing.9)]",
                  "inline-block align-middle",
                  "ion-margin-start"
                )}
              >
                <img alt={category["name"]} src={category["image"]?.["src"]} />
              </IonThumbnail>
            ) : null}
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {isSuccess ? <AdvertList category={category} /> : null}
      </IonContent>
    </IonPage>
  );
};

const AdvertList = ({ category }) => {
  const queryKey = ["adverts", "category", category["id"]];

  const { isPending, isSuccess, data, fetchNextPage } = useInfiniteQuery({
    queryKey,
    initialPageParam: "",
    queryFn: ({ signal, pageParam }) =>
      api
        .get(`/adverts?category=${category["id"]}&cursor=${pageParam}`, {
          signal,
        })
        .then((response) => response.data),
    getNextPageParam: (lastPage) => lastPage["next_cursor"],
  });

  const adverts = useMemo(
    () => data?.pages.reduce((carry, page) => carry.concat(page.data), []),
    [data]
  );

  return (
    <>
      <IonGrid>
        <IonRow>
          {isPending ? (
            <>
              <IonCol size="6" sizeSm="4" sizeMd="3">
                <AdvertPlaceholder />
              </IonCol>
              <IonCol size="6" sizeSm="4" sizeMd="3">
                <AdvertPlaceholder />
              </IonCol>
              <IonCol size="6" sizeSm="4" sizeMd="3">
                <AdvertPlaceholder />
              </IonCol>
              <IonCol size="6" sizeSm="4" sizeMd="3">
                <AdvertPlaceholder />
              </IonCol>
            </>
          ) : (
            adverts.map((advert) => {
              return (
                <IonCol key={advert["id"]} size="6" sizeSm="4" sizeMd="3">
                  <Advert advert={advert} />
                </IonCol>
              );
            })
          )}
        </IonRow>
      </IonGrid>
      <IonInfiniteScroll
        onIonInfinite={(ev) => fetchNextPage().finally(ev.target.complete())}
      >
        <IonInfiniteScrollContent></IonInfiniteScrollContent>
      </IonInfiniteScroll>
    </>
  );
};
