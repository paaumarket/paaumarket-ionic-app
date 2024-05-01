import AdvertList from "@/component/AdvertList";
import InfiniteScroll from "@/component/InfiniteScroll";
import Refresher from "@/component/Refresher";
import api from "@/lib/api";
import {
  IonBackButton,
  IonButtons,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonPage,
  IonRow,
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
                <img
                  alt={category["name"]}
                  src={category["image"]?.["cache"]?.["extra-small"]}
                  className="object-cover object-center w-full h-full"
                />
              </IonThumbnail>
            ) : null}
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {isSuccess ? (
          <IonGrid>
            <IonRow className="ion-justify-content-center">
              <IonCol size="12" sizeLg="8" sizeXl="9">
                <CategoryAdvertList category={category} />
              </IonCol>
            </IonRow>
          </IonGrid>
        ) : null}
      </IonContent>
    </IonPage>
  );
};

const CategoryAdvertList = ({ category }) => {
  const {
    isPending,
    isSuccess,
    data,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["adverts", "category", category["id"]],
    initialPageParam: "",
    queryFn: ({ signal, pageParam }) =>
      api
        .get(`/adverts?category=${category["id"]}&cursor=${pageParam}`, {
          signal,
        })
        .then((response) => response.data),
    getNextPageParam: (lastPage) => lastPage["meta"]["next_cursor"],
  });

  return (
    <>
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
