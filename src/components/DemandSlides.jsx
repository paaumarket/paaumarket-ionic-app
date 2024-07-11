import api from "@/lib/api";
import { IonAvatar, IonItem, IonLabel, IonList, IonNote } from "@ionic/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { formatDate } from "date-fns";
import DefaultUserImage from "@/assets/user-avatar.svg";
import { DemandPlaceholder } from "./DemandList";
import { Autoplay, Pagination } from "swiper/modules";
import { IonicSlides } from "@ionic/react";

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
        <Swiper
          modules={[Autoplay, Pagination, IonicSlides]}
          autoplay={true}
          pagination={true}
        >
          {Array.from({ length: 10 }).map((_, i) => (
            <SwiperSlide key={i}>
              <DemandSlidePlaceholder />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : isSuccess ? (
        <Swiper
          modules={[Autoplay, Pagination, IonicSlides]}
          autoplay={true}
          pagination={true}
        >
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
  <IonList className="w-full">
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
        <IonNote className="text-xs">
          {formatDate(demand["created_at"], "PPp")}
        </IonNote>
      </IonLabel>
    </IonItem>
  </IonList>
);

const DemandSlidePlaceholder = () => (
  <IonList className="w-full">
    <DemandPlaceholder />
  </IonList>
);
