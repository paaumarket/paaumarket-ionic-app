import {
  IonCol,
  IonContent,
  IonGrid,
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
import { Link } from "react-router-dom";

import logo from "../assets/paaumarket.svg";
import Advert, { AdvertPlaceholder } from "@/component/Advert";

export default function Home() {
  const { data, isPending, hasNextPage } = useInfiniteQuery({
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

      <IonContent className="ion-padding">
        <IonText>
          <h4 className="ion-text-center ion-no-margin">
            <b>All category</b>
          </h4>
        </IonText>

        <Category />

        <IonText className="ion-padding">
          <b>Trending ad</b>
        </IonText>

        <IonGrid>
          <IonRow>
            {isPending ? (
              <IonCol size="12" sizeMd="6" sizeLg="2">
                <AdvertPlaceholder />
              </IonCol>
            ) : (
              adverts.map((advert) => {
                return (
                  <IonCol key={advert["id"]} size="12" sizeMd="6" sizeLg="2">
                    <Advert advert={advert} />
                  </IonCol>
                );
              })
            )}
          </IonRow>
        </IonGrid>
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
          <IonCol key={category["id"]} size="6" sizeSm="4" sizeMd="3">
            <Link to="#" className="flex flex-col items-center text-center">
              <IonThumbnail className="[--size:theme(spacing.16)]">
                <img src={category["image"]["src"]} alt="" />
              </IonThumbnail>
              <IonText color={"dark"}>
                <p className="inline-block">{category["name"]}</p>
              </IonText>
            </Link>
          </IonCol>
        ))}
      </IonRow>
    </IonGrid>
  ) : null;
};
