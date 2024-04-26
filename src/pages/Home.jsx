import {
  IonCol,
  IonContent,
  IonGrid,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonPage,
  IonRow,
  IonSearchbar,
  IonSpinner,
  IonText,
  IonThumbnail,
} from "@ionic/react";
import Header from "../component/Header";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { useMemo } from "react";
import { Link, generatePath } from "react-router-dom";

import logo from "../assets/paaumarket.svg";
import Advert, { AdvertPlaceholder } from "@/component/Advert";

export default function Home() {
  const { data, isPending, hasNextPage, fetchNextPage } = useInfiniteQuery({
    initialPageParam: "",
    queryKey: ["adverts", "list"],
    queryFn: ({ signal, pageParam }) =>
      api
        .get(`/adverts?cursor=${pageParam}`, { signal })
        .then((response) => response.data),
    getNextPageParam: (lastPage) => lastPage["next_cursor"],
  });

  const adverts = useMemo(
    () => data?.pages.reduce((carry, page) => carry.concat(page.data), []),
    [data]
  );

  return (
    <IonPage>
      <Header>
        <Link to="/">
          <img src={logo} alt="Paau Market Logo" className="w-10 h-10 px-1" />
        </Link>
        <div className="grow">
          <IonSearchbar
            className="ion-searchbar"
            showClearButton="focus"
            value=""
            placeholder="Search Paau Market"
          ></IonSearchbar>
        </div>
      </Header>

      <IonContent>
        <IonText>
          <h4 className="ion-text-center ion-padding">
            <b>All category</b>
          </h4>
        </IonText>

        <Category />

        <IonText>
          <h4 className="ion-text-center ion-padding">Trending Ads</h4>
        </IonText>

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
              {category["image"] ? (
                <IonThumbnail className="[--size:theme(spacing.12)]">
                  <img src={category["image"]["src"]} alt="" />
                </IonThumbnail>
              ) : null}
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
