import AdvertList from "@/components/AdvertList";
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
  IonToolbar,
  useIonLoading,
  IonModal,
  IonText,
  IonTitle,
  IonSegment,
  IonSegmentButton,
  IonLabel,
} from "@ionic/react";
import { callOutline, logoWhatsapp, warningOutline } from "ionicons/icons";
import { useMutation } from "@tanstack/react-query";
import { useLocation, useParams } from "react-router-dom";
import withIonPageQueryRefetch from "@/hoc/withIonPageQueryRefetch";
import { useApiInfiniteQuery, useApiQuery } from "@/hooks/useApiQuery";

import logo from "@/assets/paaumarket.svg";
import SignInForm from "@/components/SignInForm";
import { useHistory } from "react-router-dom";
import { useRef } from "react";
import { useState } from "react";
import RegisterForm from "@/components/RegisterForm";

export default withIonPageQueryRefetch(function SingleAdvertPage() {
  const { user } = useAuth();
  const { id } = useParams();
  const {
    isPending,
    isSuccess,
    data: advert,
  } = useApiQuery({
    queryKey: ["advert", id],
    queryFn: ({ signal }) =>
      api.get(`/adverts/${id}`, { signal }).then((response) => response.data),
  });

  return (
    <>
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/app"></IonBackButton>
            </IonButtons>
            <IonTitle>
              {isPending
                ? "Loading..."
                : isSuccess
                ? advert["title"]
                : "Error!"}
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
                {isSuccess && advert["user_id"] !== user?.["id"] ? (
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
        {/* <SignInModal /> */}
      </IonPage>
    </>
  );
});

const AdvertContact = ({ advert }) => {
  const modal = useRef(null);
  const location = useLocation();
  const [segment, setSegment] = useState("login");

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
              <IonButton
                expand="full"
                shape="round"
                fill="solid"
                color="primary"
                id="open-modal"
              >
                <IonIcon
                  icon={callOutline}
                  className="ion-padding-end"
                ></IonIcon>
                Show Contact
              </IonButton>
              <IonModal ref={modal} trigger="open-modal">
                <IonHeader className="shadow-none">
                  <IonToolbar>
                    <IonButtons slot="start">
                      <IonButton onClick={() => modal.current?.dismiss()}>
                        Cancel
                      </IonButton>
                    </IonButtons>
                    <IonSegment
                      value={segment}
                      onIonChange={(ev) => setSegment(ev.detail.value)}
                    >
                      {/* LOGIN */}
                      <IonSegmentButton value="login">
                        <IonLabel>Login</IonLabel>
                      </IonSegmentButton>
                      {/* REGISTER */}
                      <IonSegmentButton value="signup">
                        <IonLabel>Sign Up</IonLabel>
                      </IonSegmentButton>
                    </IonSegment>
                  </IonToolbar>
                </IonHeader>

                <IonContent className="ion-padding">
                  {segment === "login" ? (
                    <>
                      <div className="flex flex-col items-center justify-center gap-4 p-4">
                        <img
                          src={logo}
                          alt="Paau Market Logo"
                          className="w-20 h-20 mx-auto mt-10"
                        />
                        <IonText className="ion-text-color">
                          <h2 className="font-light text-center ion-no-margin text-md">
                            Welcome back to PAAU Market
                          </h2>
                        </IonText>
                      </div>

                      <SignInForm
                        onSuccess={() => {
                          modal.current?.dismiss();

                          handleShowContact();
                        }}
                      />
                    </>
                  ) : null}

                  {segment === "signup" ? (
                    <>
                      <div className="flex flex-col items-center justify-center gap-4 p-4">
                        <img
                          src={logo}
                          alt="Paau Market Logo"
                          className="w-20 h-20 mx-auto mt-10"
                        />
                        <IonText className="ion-text-color">
                          <h2 className="font-light text-center ion-no-margin text-md">
                            Sign up to PAAU Market
                          </h2>
                        </IonText>
                      </div>

                      <RegisterForm
                        onSuccess={() => {
                          modal.current?.dismiss();

                          handleShowContact();
                        }}
                      />
                    </>
                  ) : null}
                </IonContent>
              </IonModal>
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
              View Contact
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
  } = useApiInfiniteQuery({
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
