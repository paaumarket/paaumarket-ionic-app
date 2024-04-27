import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonSkeletonText,
} from "@ionic/react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css/bundle";

import "@ionic/react/css/ionic-swiper.css";
import { IonicSlides } from "@ionic/react";

const Advert = ({ advert, full = false }) => {
  return (
    <IonCard
      routerLink={!full ? "/home/adverts/ad/" + advert["id"] : undefined}
      className="ion-no-margin"
    >
      {advert["preview_image"] ? (
        <img
          alt={advert["title"]}
          src={advert["preview_image"]["src"]}
          width={advert["preview_image"]["width"]}
          height={advert["preview_image"]["height"]}
          className="object-cover object-center w-full"
        />
      ) : null}

      {advert["images"] ? <AdvertImages advert={advert} /> : null}
      <IonCardHeader>
        <IonCardTitle>{advert["title"]}</IonCardTitle>
        <IonCardSubtitle>
          ₦{Intl.NumberFormat().format(advert["price"])}
        </IonCardSubtitle>
      </IonCardHeader>

      {advert["description"] ? (
        <IonCardContent>{advert["description"]}</IonCardContent>
      ) : null}
    </IonCard>
  );
};

export const AdvertImages = ({ advert }) => (
  <Swiper modules={[Navigation, IonicSlides]} navigation={true}>
    {advert["images"].map((advertImage) => (
      <SwiperSlide key={advertImage["id"]}>
        <img
          alt={advert["title"]}
          src={advertImage["image"]["src"]}
          width={advertImage["image"]["width"]}
          height={advertImage["image"]["height"]}
        />
      </SwiperSlide>
    ))}
  </Swiper>
);

export const AdvertPlaceholder = () => (
  <IonCard className="ion-no-margin">
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
);

export default Advert;
