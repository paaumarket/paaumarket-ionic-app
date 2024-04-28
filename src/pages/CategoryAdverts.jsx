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
import { generatePath, useRouteMatch } from "react-router-dom";

export default () => {
  const match = useRouteMatch();

  const {
    isPending,
    isSuccess,
    data: category,
  } = useQuery({
    queryKey: ["category", match.params.category, "sub", match.params.sub],
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
        {isSuccess ? <CategoryAdvertList category={category} /> : null}
      </IonContent>
    </IonPage>
  );
};

const CategoryAdvertList = ({ category }) => {
  const { isPending, isSuccess, data, fetchNextPage } = useInfiniteQuery({
    queryKey: ["adverts", "category", category["id"]],
    initialPageParam: "",
    queryFn: ({ signal, pageParam }) =>
      api
        .get(`/adverts?category=${category["id"]}&cursor=${pageParam}`, {
          signal,
        })
        .then((response) => response.data),
    getNextPageParam: (lastPage) => lastPage["next_cursor"],
  });

  return (
    <>
      <AdvertList isPending={isPending} isSuccess={isSuccess} data={data} />
      <IonInfiniteScroll
        onIonInfinite={(ev) => fetchNextPage().finally(ev.target.complete())}
      >
        <IonInfiniteScrollContent></IonInfiniteScrollContent>
      </IonInfiniteScroll>
    </>
  );
};
