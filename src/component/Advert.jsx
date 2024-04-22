import {
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonSkeletonText,
} from "@ionic/react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/keyboard";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/css/zoom";
import "@ionic/react/css/ionic-swiper.css";
import { IonicSlides } from "@ionic/react";

const Advert = ({ advert }) => {
  return (
    <IonCard routerLink={"/home/adverts/ad/" + advert["id"]}>
      {advert["preview_image"] ? (
        <img
          alt={advert["title"]}
          src={advert["preview_image"]["src"]}
          width={advert["preview_image"]["width"]}
          height={advert["preview_image"]["height"]}
        />
      ) : null}

      {advert["images"] ? (
        <Swiper modules={[Pagination, IonicSlides]} pagination={true}>
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
      ) : null}
      <IonCardHeader>
        <IonCardTitle>{advert["title"]}</IonCardTitle>
        <IonCardSubtitle>
          ₦{Intl.NumberFormat().format(advert["price"])}
        </IonCardSubtitle>
      </IonCardHeader>
    </IonCard>
  );
};

export const AdvertPlaceholder = () => (
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
);

export default Advert;
