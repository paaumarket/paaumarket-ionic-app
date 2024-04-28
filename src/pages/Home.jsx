import {
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonPage,
  IonRow,
  IonSearchbar,
  IonSpinner,
  IonText,
  IonThumbnail,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Link, generatePath } from "react-router-dom";

import logo from "../assets/paaumarket.svg";
import { useState } from "react";
import AdvertList from "@/component/AdvertList";
import { isPlatform } from "@ionic/react";
import { personCircleOutline } from "ionicons/icons";
import InfiniteScroll from "@/component/InfiniteScroll";
import Refresher from "@/component/Refresher";

export default function Home() {
  const [search, setSearch] = useState("");
  const {
    data,
    isPending,
    isSuccess,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    initialPageParam: "",
    queryKey: search ? ["adverts", "list", search] : ["adverts", "list"],
    queryFn: ({ signal, pageParam }) =>
      api
        .get(
          `/adverts?cursor=${pageParam}${
            search ? `&search=${encodeURIComponent(search)}` : ""
          }`,
          { signal }
        )
        .then((response) => response.data),
    getNextPageParam: (lastPage) => lastPage["meta"]["next_cursor"],
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton routerLink="/" fill="clear">
              <IonIcon icon={logo} size="large" />
            </IonButton>
          </IonButtons>
          {isPlatform("ios") ? (
            <IonTitle>Paau Market</IonTitle>
          ) : (
            <IonSearchbar
              value={search}
              debounce={500}
              onIonInput={(ev) => setSearch(ev.target.value)}
              showClearButton="always"
              placeholder="Search Paau Market"
              maxlength={30}
            />
          )}

          <IonButtons slot="end">
            <IonButton
              routerLink="/home/profile"
              fill="clear"
              color={"primary"}
            >
              <IonIcon icon={personCircleOutline} size="large" />
            </IonButton>
          </IonButtons>
        </IonToolbar>
        {isPlatform("ios") ? (
          <IonToolbar>
            <IonSearchbar
              value={search}
              debounce={500}
              onIonInput={(ev) => setSearch(ev.target.value)}
              showClearButton="always"
              placeholder="Search Paau Market"
              maxlength={30}
            />
          </IonToolbar>
        ) : null}
      </IonHeader>

      <IonContent>
        {!search ? (
          <>
            <IonText>
              <h4 className="font-bold ion-text-center ion-padding">
                All category
              </h4>
            </IonText>

            <Category />
          </>
        ) : null}

        <IonText>
          <h4 className="font-bold ion-text-center ion-padding">
            {search ? `Search: ${search}` : "Trending Ads"}
          </h4>
        </IonText>

        <Refresher refresh={refetch} />
        <AdvertList isPending={isPending} isSuccess={isSuccess} data={data} />

        <InfiniteScroll
          hasNextPage={hasNextPage}
          fetchNextPage={fetchNextPage}
          isFetchingNextPage={isFetchingNextPage}
        />
      </IonContent>
    </IonPage>
  );
}

const Category = () => {
  const { isPending, isSuccess, data } = useQuery({
    queryKey: ["categories", "index"],
    queryFn: ({ signal }) =>
      api.get("/categories", { signal }).then((response) => response.data),
  });

  return isPending ? (
    <div className="ion-text-center">
      <IonSpinner />
    </div>
  ) : isSuccess ? (
    <IonGrid className="ion-margin-bottom">
      <IonRow>
        {data.map((category) => (
          <IonCol key={category["id"]} size="4" sizeSm="3" sizeMd="2">
            <Link
              to={generatePath("/home/adverts/categories/:category", {
                category: category["slug"],
              })}
              className="flex flex-col items-center text-center"
            >
              <IonThumbnail className="[--size:theme(spacing.12)]">
                <img src={category["image"]?.["src"]} alt="" />
              </IonThumbnail>
              <IonText color={"dark"}>
                <small className="inline-block">{category["name"]}</small>
              </IonText>
            </Link>
          </IonCol>
        ))}
      </IonRow>
    </IonGrid>
  ) : null;
};
