import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonPage,
  IonRouterLink,
  IonRow,
  IonSearchbar,
  IonSkeletonText,
  IonText,
  IonTitle,
} from "@ionic/react";
import Header from "../component/Header";
import { useInfiniteQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { useMemo } from "react";
import { Link } from "react-router-dom";

import logo from "../assets/paaumarket.svg";
import gasCylinder from "../assets/category/gas.png";
import fan from "../assets/category/fan.png";
import table from "../assets/category/table.png";
import beauty from "../assets/category/beauty.png";
import lodge from "../assets/category/lodge.png";
import fashion from "../assets/category/fashion.png";
import laptop from "../assets/category/laptop.png";
import mobile from "../assets/category/mobile.png";
import food from "../assets/category/food.png";

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
        <IonText className="ion-padding">All category</IonText>

        <Category />

        <IonText className="ion-padding">
          <b>Trending ad</b>
        </IonText>

        <IonGrid>
          <IonRow>
            {isPending ? (
              <AdvertPlaceholder />
            ) : (
              adverts.map((advert) => {
                return <Advert key={advert.id} advert={advert} />;
              })
            )}
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
}

const Advert = ({ advert }) => {
  return (
    <IonCol size="12" sizeMd="6" sizeLg="2">
      <IonCard routerLink={"/home/" + advert["id"]}>
        {advert["preview_image"] ? (
          <img alt={advert["title"]} src={advert["preview_image"]["path"]} />
        ) : null}
        <IonCardHeader>
          <IonCardTitle>{advert["title"]}</IonCardTitle>
          <IonCardSubtitle>{advert.description}</IonCardSubtitle>
        </IonCardHeader>
        <IonCardContent>
          ₦{Intl.NumberFormat().format(advert["price"])}
        </IonCardContent>
      </IonCard>
    </IonCol>
  );
};

const AdvertPlaceholder = () => (
  <IonCol size="12" sizeMd="6" sizeLg="2">
    <IonCard>
      <IonSkeletonText
        animated={true}
        className="ion-no-margin aspect-square max-h-60"
      ></IonSkeletonText>
      <IonCardHeader>
        <IonCardTitle>
          <IonSkeletonText
            animated={true}
            style={{ width: "80%" }}
            className="ion-no-margin"
          ></IonSkeletonText>
        </IonCardTitle>
        <IonCardSubtitle>
          <IonSkeletonText
            animated={true}
            style={{ width: "60%" }}
            className="ion-no-margin"
          ></IonSkeletonText>
        </IonCardSubtitle>
      </IonCardHeader>
    </IonCard>
  </IonCol>
);

const Category = () => {
  return (
    <IonGrid className="ion-margin-bottom">
      <IonRow>
        <IonCol>
          <IonRouterLink
            href="#"
            className="text-center flex flex-col"
            color="dark"
          >
            <img className="m-auto" src={lodge} alt="" />
            <p className="inline-block">Lodge</p>
          </IonRouterLink>
        </IonCol>
        <IonCol>
          <IonRouterLink
            href="#"
            className="text-center flex flex-col"
            color="dark"
          >
            <img className="m-auto" src={mobile} alt="" />
            <p className="inline-block">Phone</p>
          </IonRouterLink>
        </IonCol>
        <IonCol>
          <IonRouterLink
            href="#"
            className="text-center flex flex-col"
            color="dark"
          >
            <img className="m-auto" src={laptop} alt="" />
            <p className="inline-block">Laptop</p>
          </IonRouterLink>
        </IonCol>
      </IonRow>

      <IonRow>
        <IonCol>
          <IonRouterLink
            href="#"
            className="text-center flex flex-col"
            color="dark"
          >
            <img className="m-auto" src={beauty} alt="" />
            <p className="inline-block">Beauty</p>
          </IonRouterLink>
        </IonCol>
        <IonCol>
          <IonRouterLink
            href="#"
            className="text-center flex flex-col"
            color="dark"
          >
            <img className="m-auto" src={fashion} alt="" />
            <p className="inline-block">Fashion</p>
          </IonRouterLink>
        </IonCol>
        <IonCol>
          <IonRouterLink
            href="#"
            className="text-center flex flex-col"
            color="dark"
          >
            <img className="m-auto" src={food} alt="" />
            <p className="inline-block">Food & Snacks</p>
          </IonRouterLink>
        </IonCol>
      </IonRow>

      <IonRow>
        <IonCol>
          <IonRouterLink
            href="#"
            className="text-center flex flex-col"
            color="dark"
          >
            <img className="m-auto" src={gasCylinder} alt="" />
            <p className="inline-block">Gas Cylinder</p>
          </IonRouterLink>
        </IonCol>
        <IonCol>
          <IonRouterLink
            href="#"
            className="text-center flex flex-col"
            color="dark"
          >
            <img className="m-auto" src={fan} alt="" />
            <p className="inline-block">Fan</p>
          </IonRouterLink>
        </IonCol>
        <IonCol>
          <IonRouterLink
            href="#"
            className="text-center flex flex-col"
            color="dark"
          >
            <img className="m-auto" src={table} alt="" />
            <p className="inline-block">Table & Chair</p>
          </IonRouterLink>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};
