import DemandList from "@/components/DemandList";
import InfiniteScroll from "@/components/InfiniteScroll";
import Refresher from "@/components/Refresher";
import api from "@/lib/api";
import {
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useInfiniteQuery } from "@tanstack/react-query";

export default function Demands() {
  const {
    isPending,
    isSuccess,
    data,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["demands"],
    initialPageParam: "",
    queryFn: ({ signal, pageParam }) =>
      api
        .get(`/demands?cursor=${pageParam}`, {
          signal,
        })
        .then((response) => response.data),
    getNextPageParam: (lastPage) => lastPage["meta"]["next_cursor"],
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Demands</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonButton expand="block" routerLink="/app/demands/new">
          Create Demand
        </IonButton>

        <Refresher refresh={refetch} />
        <DemandList isPending={isPending} isSuccess={isSuccess} data={data} />
        <InfiniteScroll
          hasNextPage={hasNextPage}
          fetchNextPage={fetchNextPage}
          isFetchingNextPage={isFetchingNextPage}
        />
      </IonContent>
    </IonPage>
  );
}
