import {
  IonAvatar,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonSkeletonText,
} from "@ionic/react";

import { formatDistanceToNow } from "date-fns";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css/bundle";

import "@ionic/react/css/ionic-swiper.css";
import { IonicSlides } from "@ionic/react";
import { Link, generatePath } from "react-router-dom";
import clsx from "clsx";

import DefaultUserImage from "@/assets/user@100.png";

const Advert = ({ advert, full = false }) => {
  return (
    <IonCard
      routerLink={!full ? "/home/adverts/ad/" + advert["id"] : undefined}
      className="ion-no-margin"
    >
      {advert["preview_image"] ? (
        <div className="relative">
          <img
            alt={advert["title"]}
            src={advert["preview_image"]["src"]}
            width={advert["preview_image"]["width"]}
            height={advert["preview_image"]["height"]}
            className="object-cover object-center w-full"
          />
          <span
            className={clsx(
              "absolute",
              "bottom-0 right-1",
              "bg-[var(--ion-color-light)] text-[var(--ion-color-light-contrast)]",
              "text-xs",
              "p-1 rounded-t"
            )}
          >
            {advert["images_count"]}
          </span>
        </div>
      ) : null}

      {advert["images"] ? <AdvertImages advert={advert} /> : null}
      <IonCardHeader>
        <IonCardTitle className="text-lg font-bold">
          {advert["title"]}
        </IonCardTitle>
        <IonCardSubtitle>
          ₦{Intl.NumberFormat().format(advert["price"])}
        </IonCardSubtitle>
      </IonCardHeader>
      <IonCardContent>
        <div className="flex flex-col gap-2">
          {advert["user"] ? (
            <Link
              to={generatePath("/home/adverts/user/:id", {
                id: advert["user"]["id"],
              })}
              className="flex flex-wrap items-center gap-2"
            >
              <IonAvatar className={clsx("w-6 h-6")}>
                <img
                  alt={advert["user"]["name"]}
                  src={
                    advert["user"]["profile_photo"]?.["src"] || DefaultUserImage
                  }
                />
              </IonAvatar>{" "}
              {advert["user"]["name"]}
            </Link>
          ) : null}
          {full ? <p>{formatDistanceToNow(advert["created_at"])}</p> : null}
          {advert["description"] ? <p>{advert["description"]}</p> : null}
        </div>
      </IonCardContent>
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
