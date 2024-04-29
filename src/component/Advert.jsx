import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "@ionic/react/css/ionic-swiper.css";

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
import { FreeMode, Navigation, Thumbs } from "swiper/modules";

import { IonicSlides } from "@ionic/react";
import { Link, generatePath } from "react-router-dom";
import clsx from "clsx";

import DefaultUserImage from "@/assets/user@100.png";
import { useState } from "react";

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
            src={advert["preview_image"]["cache"]["medium"]}
            width={advert["preview_image"]["width"]}
            height={advert["preview_image"]["height"]}
            className="object-cover object-center w-full"
          />
          <span
            className={clsx(
              "absolute",
              "bottom-0 right-0",
              "bg-[var(--ion-color-tertiary)]",
              "text-[var(--ion-color-tertiary-contrast)]",
              "text-xs",
              "p-1 rounded-tl",
              "font-bold",
              "leading-none"
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
      {full ? (
        <IonCardContent>
          <div className="flex flex-col gap-2">
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
                    advert["user"]["profile_photo"]?.["cache"]?.[
                      "extra-small"
                    ] || DefaultUserImage
                  }
                />
              </IonAvatar>{" "}
              {advert["user"]["name"]}
            </Link>
            <p>{formatDistanceToNow(advert["created_at"])}</p>
            <p>{advert["description"]}</p>
          </div>
        </IonCardContent>
      ) : null}
    </IonCard>
  );
};

export const AdvertImages = ({ advert }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  return (
    <div>
      {/* Main */}
      <Swiper
        spaceBetween={10}
        navigation={true}
        thumbs={{
          swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
        }}
        modules={[FreeMode, Navigation, Thumbs, IonicSlides]}
        className="[&.swiper_.swiper-slide]:h-auto"
        autoHeight
      >
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

      {/* Thumbs */}
      <div className="ion-padding">
        <Swiper
          onSwiper={setThumbsSwiper}
          spaceBetween={10}
          slidesPerView={4}
          freeMode={true}
          watchSlidesProgress={true}
          modules={[FreeMode, Navigation, Thumbs]}
          className={clsx(
            "[&.swiper_.swiper-slide]:h-auto",
            "[&.swiper_.swiper-slide]:items-stretch"
          )}
        >
          {advert["images"].map((advertImage) => (
            <SwiperSlide
              key={advertImage["id"]}
              className={clsx(
                "w-1/3 h-full",
                "opacity-60",
                "[&.swiper-slide-thumb-active]:opacity-100"
              )}
            >
              <img
                className={clsx("w-full h-full object-cover object-center")}
                alt={advert["title"]}
                src={advertImage["image"]["src"]}
                width={advertImage["image"]["width"]}
                height={advertImage["image"]["height"]}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

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
