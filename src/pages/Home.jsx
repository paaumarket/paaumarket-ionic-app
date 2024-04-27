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
import { Link, generatePath } from "react-router-dom";

import logo from "../assets/paaumarket.svg";
import { useState } from "react";
import AdvertList from "@/component/AdvertList";

export default function Home() {
  const [search, setSearch] = useState("");
  const { data, isPending, isSuccess, hasNextPage, fetchNextPage } =
    useInfiniteQuery({
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
      getNextPageParam: (lastPage) => lastPage["next_cursor"],
    });

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
            value={search}
            debounce={500}
            onIonInput={(ev) => setSearch(ev.target.value)}
            placeholder="Search Paau Market"
            maxlength={30}
          ></IonSearchbar>
        </div>
      </Header>

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

        <AdvertList isPending={isPending} isSuccess={isSuccess} data={data} />

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
