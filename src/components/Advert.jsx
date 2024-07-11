import DefaultUserImage from "@/assets/user-avatar.svg";
import DefaultCategoryImage from "@/assets/category.svg";
import clsx from "clsx";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import {
  IonAvatar,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonItem,
  IonLabel,
  IonNote,
  IonSkeletonText,
  IonText,
  IonThumbnail,
} from "@ionic/react";
import { IonicSlides } from "@ionic/react";
import { Link, generatePath } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { formatDate } from "date-fns";
import { useState } from "react";

const Advert = ({ mode, ...props }) => {
  return mode === "list" ? (
    <AdvertStyleList {...props} />
  ) : (
    <AdvertStyleGrid {...props} />
  );
};

const AdvertStyleList = ({ advert }) => {
  return (
    <IonItem
      key={advert["id"]}
      routerLink={"/app/adverts/ad/" + advert["id"]}
      className="[--padding-start:8px]"
    >
      <IonThumbnail
        slot="start"
        className="[--size:theme(spacing.32)] relative"
      >
        <img
          alt={advert["title"]}
          src={advert["preview_image"]["cache"]["medium"]}
          width={advert["preview_image"]["width"]}
          height={advert["preview_image"]["height"]}
          className="object-cover object-center w-full h-full"
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
      </IonThumbnail>
      <IonLabel>
        {advert["price"] ? (
          <IonNote color={"primary"}>
            ₦{Intl.NumberFormat().format(advert["price"])}
          </IonNote>
        ) : null}
        <h3 className="!my-2">
          <IonText className="font-bold">{advert["title"]}</IonText>
        </h3>
        <AdvertPreviewSeller advert={advert} />
        <p>
          <IonNote className="text-xs">
            {formatDate(advert["created_at"], "PPp")}
          </IonNote>
        </p>
      </IonLabel>
    </IonItem>
  );
};

const AdvertPreviewSeller = ({ advert }) => (
  <p className="flex flex-wrap items-center gap-2 text-xs">
    <IonAvatar className="w-5 h-5">
      <img
        src={
          advert["user_profile_photo"]?.["cache"]?.["extra-small"] ||
          DefaultUserImage
        }
        className="object-cover object-center w-full h-full"
      />
    </IonAvatar>{" "}
    {advert["user_name"]}
  </p>
);

const AdvertStyleGrid = ({ advert, full = false }) => {
  return (
    <IonCard
      routerLink={!full ? "/app/adverts/ad/" + advert["id"] : undefined}
      className="h-full ion-no-margin"
    >
      {advert["preview_image"] ? <AdvertPreviewImage advert={advert} /> : null}
      {advert["images"] ? <AdvertImages advert={advert} /> : null}

      <IonCardHeader>
        <IonCardTitle
          className={clsx("text-sm font-bold", !full ? "truncate" : null)}
        >
          {advert["title"]}
        </IonCardTitle>

        {/* Price */}
        {advert["price"] ? (
          <IonCardSubtitle color={"primary"} className="text-sm">
            ₦{Intl.NumberFormat().format(advert["price"])}
          </IonCardSubtitle>
        ) : null}

        {!full ? <AdvertPreviewSeller advert={advert} /> : null}
        {!full ? (
          <p className="ion-no-margin">
            <IonNote className="text-xs">
              {formatDate(advert["created_at"], "PPp")}
            </IonNote>
          </p>
        ) : null}
      </IonCardHeader>
      {full ? (
        <IonCardContent>
          <div className="flex flex-col gap-2">
            <Link
              to={generatePath("/app/adverts/user/:id", {
                id: advert["user"]["id"],
              })}
              className="inline-flex flex-wrap items-center gap-2"
            >
              <IonAvatar className={clsx("w-6 h-6")}>
                <img
                  alt={advert["user"]["name"]}
                  src={
                    advert["user"]["profile_photo"]?.["cache"]?.[
                      "extra-small"
                    ] || DefaultUserImage
                  }
                  className="object-cover object-center w-full h-full"
                />
              </IonAvatar>{" "}
              {advert["user"]["name"]}
            </Link>
            {/* Category */}
            <Link
              to={generatePath("/app/adverts/categories/:parent/:sub", {
                parent: advert["category"]["parent"]["slug"],
                sub: advert["category"]["slug"],
              })}
              className="inline-flex flex-wrap items-center gap-2"
            >
              <IonAvatar className={clsx("w-6 h-6")}>
                <img
                  alt={advert["category"]["name"]}
                  src={
                    advert["category"]["image"]?.["cache"]?.["extra-small"] ||
                    DefaultCategoryImage
                  }
                  className="object-cover object-center w-full h-full"
                />
              </IonAvatar>{" "}
              {advert["category"]["name"]}
            </Link>

            <p>{formatDate(advert["created_at"], "PPp")}</p>
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
              src={advertImage["image"]["cache"]["large"]}
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
                src={advertImage["image"]["cache"]["small"]}
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

export const AdvertPlaceholder = ({ mode }) => {
  return mode === "list" ? (
    <IonItem className="[--padding-start:8px]">
      <IonThumbnail
        slot="start"
        className="[--size:theme(spacing.32)] relative"
      >
        <IonSkeletonText animated={true}></IonSkeletonText>
      </IonThumbnail>
      <IonLabel>
        <IonSkeletonText
          animated={true}
          style={{ width: "20%" }}
        ></IonSkeletonText>
        <IonSkeletonText
          animated={true}
          style={{ width: "80%" }}
        ></IonSkeletonText>
        <IonSkeletonText
          animated={true}
          style={{ width: "50%" }}
        ></IonSkeletonText>
      </IonLabel>
    </IonItem>
  ) : (
    <IonCard className="ion-no-margin">
      <IonSkeletonText
        animated={true}
        className="h-52 ion-no-margin aspect-square"
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
          <IonSkeletonText
            animated={true}
            style={{ width: "40%" }}
            className="ion-no-margin"
          ></IonSkeletonText>
        </IonCardSubtitle>
      </IonCardHeader>
    </IonCard>
  );
};

const AdvertPreviewImage = ({ advert }) => (
  <div className="relative">
    <img
      alt={advert["title"]}
      src={advert["preview_image"]["cache"]["medium"]}
      width={advert["preview_image"]["width"]}
      height={advert["preview_image"]["height"]}
      className="object-cover object-center w-full h-60"
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
);

export default Advert;
