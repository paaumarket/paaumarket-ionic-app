import api from "@/lib/api";
import useAuth from "@/hooks/useAuth";
import Advert, { AdvertPlaceholder } from "@/components/Advert";
import {
  IonBackButton,
  IonButton,
  IonButtons,
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
  IonTitle,
  IonToolbar,
  useIonLoading,
} from "@ionic/react";
import { Link } from "react-router-dom";
import { callOutline, logoWhatsapp, warningOutline } from "ionicons/icons";
import { useLocation, useParams } from "react-router-dom";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import AdvertList from "@/components/AdvertList";

export default function SingleAdvertPage() {
  const { user } = useAuth();
  const { id } = useParams();
  const {
    isPending,
    isSuccess,
    data: advert,
  } = useQuery({
    queryKey: ["advert", id],
    queryFn: ({ signal }) =>
      api.get(`/adverts/${id}`, { signal }).then((response) => response.data),
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/app"></IonBackButton>
          </IonButtons>
          <IonTitle>
            {isPending ? "Loading..." : isSuccess ? advert["title"] : "Error!"}
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonGrid>
          <IonRow className="ion-justify-start">
            <IonCol size="12" sizeXl="8">
              {isPending ? (
                <AdvertPlaceholder />
              ) : (
                <div className="flex flex-col gap-4">
                  <Advert full advert={advert} />
                </div>
              )}
            </IonCol>
            <IonCol size="12" sizeXl="4">
              {isSuccess && advert["user_id"] !== user["id"] ? (
                <AdvertContact advert={advert} />
              ) : null}
            </IonCol>
          </IonRow>

          {isSuccess && advert["status"] === "approved" ? (
            <IonRow className="ion-justify-start">
              <IonCol size="12" sizeXl="8">
                <SimilarAdverts advert={advert} />
              </IonCol>
            </IonRow>
          ) : null}
        </IonGrid>
      </IonContent>
    </IonPage>
  );
}

const AdvertContact = ({ advert }) => {
  const location = useLocation();
  const { user } = useAuth();
  const { data, mutateAsync, isSuccess } = useMutation({
    mutationKey: ["advert", advert["id"], "contact"],
    mutationFn: () =>
      api
        .post(`/adverts/${advert["id"]}/contact`)
        .then((response) => response.data),
  });

  const [presentLoading, dismissLoading] = useIonLoading();

  const handleShowContact = () => {
    presentLoading({
      message: "Fetching contact...",
    })
      /** Mutate */
      .then(() => mutateAsync(null))

      /** Dismiss Loading */
      .finally(() => dismissLoading());
  };

  return (
    <IonCard className="ion-no-margin">
      <IonCardHeader>
        <IonCardTitle>
          {isSuccess ? data["mobile_number"] : "Contact"}
        </IonCardTitle>
        <IonCardSubtitle>
          {isSuccess ? "Contact" : "Request owner contact"}
        </IonCardSubtitle>
      </IonCardHeader>
      <IonCardContent>
        <div className="flex flex-col gap-2">
          {!user ? (
            <p>
              You need to sign in first to see contact:{" "}
              <Link to={`/login?return=${location.pathname}`}>Login</Link>
            </p>
          ) : isSuccess ? (
            <>
              <IonButton
                className="ion-margin-top"
                expand="full"
                shape="round"
                fill="solid"
                color="primary"
                href={`tel:${data["mobile_number"]}`}
              >
                <IonIcon
                  icon={callOutline}
                  className="ion-padding-end"
                ></IonIcon>
                Call
              </IonButton>
              <IonButton
                expand="full"
                shape="round"
                fill="outline"
                href={`https://wa.me/234${
                  data["mobile_number"]
                }?text=${encodeURIComponent(
                  `Hi, I'm interested in your advert on Paau Market - ${
                    advert["title"]
                  } - ₦${Intl.NumberFormat().format(advert["price"])}`
                )}`}
                target="_blank"
              >
                <IonIcon
                  icon={logoWhatsapp}
                  className="ion-padding-end"
                ></IonIcon>
                WhatsApp Message
              </IonButton>

              <p className="p-2 text-sm rounded-md bg-[var(--ion-color-warning)] text-[var(--ion-color-warning-contrast)]">
                <IonIcon
                  className="inline-block mr-1 align-middle"
                  icon={warningOutline}
                />
                Do not pay in advance even for the delivery!
              </p>
            </>
          ) : (
            <IonButton
              expand="full"
              shape="round"
              fill="solid"
              color="primary"
              onClick={handleShowContact}
            >
              <IonIcon icon={callOutline} className="ion-padding-end"></IonIcon>
              Show Contact
            </IonButton>
          )}
        </div>
      </IonCardContent>
    </IonCard>
  );
};

const SimilarAdverts = ({ advert }) => {
  const {
    data,
    isPending,
    isSuccess,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    initialPageParam: "",
    queryKey: ["advert", advert["id"], "similar"],
    queryFn: ({ signal, pageParam }) =>
      api
        .get(`/adverts/${advert["id"]}/similar?cursor=${pageParam}`, { signal })
        .then((response) => response.data),
    getNextPageParam: (lastPage) => lastPage["meta"]["next_cursor"],
  });

  return (
    <>
      <AdvertList
        title={"Similar or Related"}
        isPending={isPending}
        isSuccess={isSuccess}
        data={data}
      />
    </>
  );
};
