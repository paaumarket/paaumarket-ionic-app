import api from "@/lib/api";
import repeatComponent from "@/utils/repeatComponent";
import useAuth from "@/hooks/useAuth";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonPage,
  IonSearchbar,
  IonText,
  IonThumbnail,
  IonTitle,
  IonToolbar,
  useIonAlert,
  useIonLoading,
  useIonToast,
} from "@ionic/react";
import { isPlatform } from "@ionic/react";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { useMemo } from "react";
import { useState } from "react";

import InfiniteScroll from "./InfiniteScroll";
import { AdvertPlaceholder } from "./Advert";
import { formatDate } from "date-fns";
import { eyeOutline } from "ionicons/icons";
import clsx from "clsx";

export default function AdvertPicker({ demand, onSuccess, onCancelled }) {
  const { user } = useAuth();
  const [search, setSearch] = useState("");

  const {
    isPending,
    isSuccess,
    data,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["adverts", "user", user["id"], search],
    initialPageParam: "",
    queryFn: ({ signal, pageParam }) =>
      api
        .get(
          `/adverts?user=${user["id"]}${
            search ? `&search=${encodeURIComponent(search)}` : ""
          }&cursor=${pageParam}`,
          {
            signal,
          }
        )
        .then((response) => response.data),
    getNextPageParam: (lastPage) => lastPage["meta"]["next_cursor"],
  });

  const adverts = useMemo(
    () => data?.pages.reduce((carry, page) => carry.concat(page.data), []),
    [data]
  );

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={() => onCancelled()}>Cancel</IonButton>
          </IonButtons>
          {isPlatform("ios") ? (
            <IonTitle>{demand["title"]}</IonTitle>
          ) : (
            <IonSearchbar
              value={search}
              debounce={500}
              onIonInput={(ev) => setSearch(ev.target.value)}
              showClearButton="always"
              placeholder="Search"
              maxlength={30}
            />
          )}
        </IonToolbar>
        {isPlatform("ios") ? (
          <IonToolbar>
            <IonSearchbar
              value={search}
              debounce={500}
              onIonInput={(ev) => setSearch(ev.target.value)}
              showClearButton="always"
              placeholder="Search"
              maxlength={30}
            />
          </IonToolbar>
        ) : null}
      </IonHeader>
      <IonContent fullscreen>
        <IonList>
          {isPending
            ? repeatComponent(<AdvertPlaceholder mode={"list"} />, 10)
            : isSuccess
            ? adverts.map((advert) => {
                return (
                  <AdvertItem
                    key={advert["id"]}
                    demand={demand}
                    advert={advert}
                    onSuccess={onSuccess}
                  />
                );
              })
            : null}
        </IonList>

        <InfiniteScroll
          hasNextPage={hasNextPage}
          fetchNextPage={fetchNextPage}
          isFetchingNextPage={isFetchingNextPage}
        />
      </IonContent>
    </IonPage>
  );
}

const AdvertItem = ({ demand, advert, onSuccess }) => {
  const submissionMutation = useSubmissionMutation({
    demand: demand["id"],
    advert: advert["id"],
  });
  const submissionAlert = useSubmissionAlert({
    advert,
    onSubmit: () => submissionMutation.mutateAsync(),
    onSuccess,
  });

  return (
    <IonItem button onClick={submissionAlert}>
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

        <p>
          <IonNote className="text-xs" color={"tertiary"}>
            <IonIcon icon={eyeOutline} /> {advert["views_count"]}
          </IonNote>{" "}
          -{" "}
          <IonNote className="text-xs">
            {formatDate(advert["created_at"], "PPp")}
          </IonNote>{" "}
        </p>
      </IonLabel>
    </IonItem>
  );
};

function useSubmissionAlert({ advert, onSubmit, onSuccess }) {
  const [presentToast, dismissToast] = useIonToast();
  const [presentAlert, dismissAlert] = useIonAlert();
  const [presentLoading, dismissLoading] = useIonLoading();

  return () =>
    presentAlert({
      header: "Submit Advert",
      subHeader: advert["title"],
      message: "Are you sure you want to submit this advert?",
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
        },
        {
          text: "OK",
          role: "confirm",
          handler: () => {
            presentLoading("Submitting....")
              .then(onSubmit)
              .then(() => {
                presentToast({
                  message: "Successfully submitted.",
                  color: "success",
                  duration: 2000,
                });
              })
              .then(onSuccess)
              .catch(() =>
                presentToast({
                  message: "Failed to submit...",
                  color: "danger",
                  duration: 2000,
                })
              )

              .finally(() => dismissLoading());
          },
        },
      ],
    });
}

const useSubmissionMutation = ({ demand, advert }) =>
  useMutation({
    mutationKey: ["demands", demand, "submission"],
    mutationFn: () =>
      api
        .post(`/demands/${demand}/submissions`, {
          ["advert_id"]: advert,
        })
        .then((response) => response.data),
  });
