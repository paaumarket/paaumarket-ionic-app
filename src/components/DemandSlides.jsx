import DefaultUserImage from "@/assets/user-avatar.svg";
import api from "@/lib/api";
import { Autoplay } from "swiper/modules";
import { IonAvatar, IonIcon, IonItem, IonLabel, IonNote } from "@ionic/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { eyeOutline } from "ionicons/icons";
import { formatDate } from "date-fns";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { DemandPlaceholder } from "./DemandList";

export default function DemandSlides() {
  const {
    isPending,
    isSuccess,
    data,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["demands"],
    initialPageParam: "",
    queryFn: ({ signal, pageParam }) =>
      api
        .get(`/demands?cursor=${pageParam}`, {
          signal,
        })
        .then((response) => response.data),
    getNextPageParam: (lastPage) => lastPage["meta"]["next_cursor"],
  });

  const demands = useMemo(
    () => data?.pages.reduce((carry, page) => carry.concat(page.data), []),
    [data]
  );

  return (
    <>
      <h5 className="font-bold">Demands</h5>
      {isPending ? (
        <Swiper modules={[Autoplay]} autoplay={{ delay: 5000 }}>
          {Array.from({ length: 10 }).map((_, i) => (
            <SwiperSlide key={i}>
              <DemandSlidePlaceholder />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : isSuccess ? (
        <Swiper modules={[Autoplay]} autoplay={{ delay: 5000 }}>
          {demands.map((demand) => (
            <SwiperSlide key={demand["id"]}>
              <DemandSlide demand={demand} />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : null}
    </>
  );
}

const DemandSlide = ({ demand }) => (
  <div className="w-full pb-8">
    <IonItem
      routerLink={`/app/demands/${demand["id"]}`}
      className="ion-align-items-start"
    >
      <IonAvatar className="w-9 h-9" slot="start">
        <img
          src={
            demand["user_profile_photo"]?.["cache"]?.["extra-small"] ||
            DefaultUserImage
          }
          className="object-cover object-center w-full h-full"
        />
      </IonAvatar>

      <IonLabel>
        <h3 style={{ fontWeight: "bold" }}>{demand["title"]}</h3>
        <p>{demand["description"] || "(No description)"}</p>
        <p>
          <IonNote color={"tertiary"}>{demand["user_name"]}</IonNote>
        </p>
        <p>
          <IonNote className="text-xs" color={"tertiary"}>
            <IonIcon icon={eyeOutline} /> {demand["views_count"]}
          </IonNote>{" "}
          -{" "}
          <IonNote className="text-xs">
            {formatDate(demand["created_at"], "PPp")}
          </IonNote>{" "}
        </p>
      </IonLabel>
    </IonItem>
  </div>
);

const DemandSlidePlaceholder = () => (
  <div className="w-full pb-8">
    <DemandPlaceholder />
  </div>
);
