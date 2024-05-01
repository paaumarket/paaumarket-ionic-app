import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
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
import { generatePath } from "react-router-dom";

import logo from "../assets/paaumarket.svg";
import { useState } from "react";
import AdvertList from "@/component/AdvertList";
import { isPlatform } from "@ionic/react";
import { personCircleOutline } from "ionicons/icons";
import InfiniteScroll from "@/component/InfiniteScroll";
import Refresher from "@/component/Refresher";
import clsx from "clsx";

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
            <IonButton fill="clear" onClick={() => refetch()}>
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
        <IonGrid>
          <IonRow className="ion-justify-content-center">
            <IonCol size="12" sizeLg="4" sizeXl="3" className="p-0">
              {!search ? (
                <>
                  <IonText>
                    <h4 className="font-bold max-lg:text-center ion-padding ion-no-margin">
                      All category
                    </h4>
                  </IonText>

                  <Category />
                </>
              ) : null}
            </IonCol>
            <IonCol>
              <IonText>
                <h4 className="font-bold max-lg:text-center ion-padding ion-no-margin">
                  {search ? `Search: ${search}` : "Trending Ads"}
                </h4>
              </IonText>

              <AdvertList
                isPending={isPending}
                isSuccess={isSuccess}
                data={data}
              />
            </IonCol>
          </IonRow>
        </IonGrid>
        <Refresher refresh={refetch} />
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
    <IonGrid className="px-0">
      <IonRow className="ion-justify-content-center">
        {data.map((category) => (
          <IonCol
            key={category["id"]}
            size="4"
            sizeSm="3"
            sizeMd="2"
            sizeLg="12"
          >
            <IonCard
              className="flex flex-col justify-center w-full h-full ion-no-margin"
              routerLink={generatePath("/home/adverts/categories/:category", {
                category: category["slug"],
              })}
            >
              <IonCardContent
                className={clsx(
                  "p-2",
                  "flex flex-col items-center justify-center text-center",
                  "lg:flex-row lg:text-start lg:gap-2 lg:justify-start"
                )}
              >
                <IonThumbnail className="[--size:theme(spacing.10)]">
                  <img
                    src={category["image"]?.["cache"]?.["extra-small"]}
                    alt={category["name"]}
                    className="object-cover object-center w-full h-full"
                  />
                </IonThumbnail>
                <div className="max-lg:text-xs">
                  <IonText color={"dark"}>{category["name"]}</IonText>
                </div>
              </IonCardContent>
            </IonCard>
          </IonCol>
        ))}
      </IonRow>
    </IonGrid>
  ) : null;
};
