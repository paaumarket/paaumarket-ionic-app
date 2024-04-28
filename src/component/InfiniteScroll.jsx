import { IonInfiniteScroll, IonInfiniteScrollContent } from "@ionic/react";

export default function InfiniteScroll({
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
}) {
  return hasNextPage ? (
    <IonInfiniteScroll
      onIonInfinite={(ev) =>
        !isFetchingNextPage
          ? fetchNextPage().finally(() => ev.target.complete())
          : ev.target.complete()
      }
    >
      <IonInfiniteScrollContent></IonInfiniteScrollContent>
    </IonInfiniteScroll>
  ) : null;
}
