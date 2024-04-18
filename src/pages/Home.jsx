import {
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
import { personCircleOutline } from "ionicons/icons";

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
          <img src={logo} alt="Paau Market Logo" className="w-10 h-10" />
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
        <IonText className="ion-padding">Find anything in store.</IonText>

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
