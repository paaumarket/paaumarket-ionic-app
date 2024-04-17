import {
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCol,
  IonContent,
  IonGrid,
  IonPage,
  IonRow,
  IonSearchbar,
  IonSkeletonText,
  IonText,
} from "@ionic/react";
import Header from "../component/Header";
import { useInfiniteQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { useMemo } from "react";

const advert_list = [
  {
    id: "1",
    img_src:
      "https://www-konga-com-res.cloudinary.com/w_auto,f_auto,fl_lossy,dpr_auto,q_auto/media/catalog/advert/V/U/118566_1709127739.jpg",
    name: "Xiaomi Redmi A3 - 6.71 -4gb Ram/ 128gb",
    price: "N116,000.00 ",
  },

  {
    id: "2",
    img_src:
      "https://www-konga-com-res.cloudinary.com/w_auto,f_auto,fl_lossy,dpr_auto,q_auto/media/catalog/advert/C/S/225561_1699955276.jpg",
    price: "N1,532,600.00",
    name: "Apple iPhone 15 Pro 128GB White",
  },
];

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
      <Header></Header>

      <IonContent className="ion-padding">
        <IonText className="ion-padding">Find anything in store.</IonText>

        <IonSearchbar
          showClearButton="focus"
          value=""
          placeholder="Search Paau Market"
        ></IonSearchbar>

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
          <IonCardSubtitle>{advert["price"]}</IonCardSubtitle>
        </IonCardHeader>
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
