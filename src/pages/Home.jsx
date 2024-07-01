import AdvertList from "@/components/AdvertList";
import DefaultUserImage from "@/assets/user-avatar.svg";
import InfiniteScroll from "@/components/InfiniteScroll";
import Refresher from "@/components/Refresher";
import api from "@/lib/api";
import clsx from "clsx";
import useAuth from "@/hooks/useAuth";
import {
  IonAvatar,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonMenu,
  IonMenuButton,
  IonMenuToggle,
  IonPage,
  IonRow,
  IonSearchbar,
  IonSpinner,
  IonText,
  IonThumbnail,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import {
  addCircleOutline,
  barChartOutline,
  basketOutline,
  callOutline,
  cashOutline,
  homeOutline,
  lockClosedOutline,
  logOutOutline,
  megaphoneOutline,
  personCircleOutline,
} from "ionicons/icons";
import { generatePath } from "react-router-dom";
import { isPlatform } from "@ionic/react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function Home() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
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
    queryKey: search ? ["adverts", "list", search] : ["adverts", "list"],
    queryFn: ({ signal, pageParam }) =>
      api
        .get(
          `/adverts?cursor=${pageParam}${
            search ? `&search=${encodeURIComponent(search)}` : ""
          }`,
          { signal }
        )
        .then((response) => response.data),
    getNextPageParam: (lastPage) => lastPage["meta"]["next_cursor"],
  });

  return (
    <>
      <IonMenu contentId="main-content">
        <IonHeader>
          <IonToolbar>
            <IonTitle>Paau Market</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          {/* User Details */}
          {user ? (
            <div className="flex flex-col items-center justify-center gap-4 ion-padding">
              <IonAvatar className="w-28 h-28">
                <img
                  src={
                    user["profile_photo"]?.["cache"]?.["medium"] ||
                    DefaultUserImage
                  }
                  alt={user["name"]}
                  className="object-cover object-center w-full h-full"
                />
              </IonAvatar>
              <h1 className="text-lg font-bold text-center truncate ion-no-margin">
                {user["name"]}
              </h1>
              <h3 className="text-center truncate ion-no-margin">
                <IonText
                  color={
                    user["wallet_balance"] <= 100
                      ? "danger"
                      : user["wallet_balance"] < 1000
                      ? "warning"
                      : "success"
                  }
                >
                  ₦{Intl.NumberFormat().format(user["wallet_balance"])}
                </IonText>
              </h3>
            </div>
          ) : null}
          <IonList>
            <IonMenuToggle>
              <IonItem routerLink="/app/adverts">
                <IonIcon slot="start" icon={homeOutline}></IonIcon>
                <IonLabel>Home</IonLabel>
              </IonItem>
            </IonMenuToggle>

            <IonMenuToggle>
              <IonItem routerLink="/app/sell">
                <IonIcon slot="start" icon={addCircleOutline}></IonIcon>
                <IonLabel>Sell</IonLabel>
              </IonItem>
            </IonMenuToggle>

            {user ? (
              <>
                <IonMenuToggle>
                  <IonItem routerLink="/app/me">
                    <IonIcon slot="start" icon={personCircleOutline}></IonIcon>
                    <IonLabel>My Profile</IonLabel>
                  </IonItem>
                </IonMenuToggle>

                {user["permissions"].includes("access-dashboard") ? (
                  <IonMenuToggle>
                    <IonItem routerLink="/app/me/admin">
                      <IonIcon slot="start" icon={barChartOutline}></IonIcon>
                      <IonLabel>Admin Panel</IonLabel>
                    </IonItem>
                  </IonMenuToggle>
                ) : null}

                <IonMenuToggle>
                  <IonItem routerLink="/how-to-sell">
                    <IonIcon slot="start" icon={cashOutline}></IonIcon>
                    <IonLabel>How To Sell</IonLabel>
                  </IonItem>
                </IonMenuToggle>

                <IonMenuToggle>
                  <IonItem routerLink="/how-to-buy">
                    <IonIcon slot="start" icon={basketOutline}></IonIcon>
                    <IonLabel>How To Buy</IonLabel>
                  </IonItem>
                </IonMenuToggle>

                <IonMenuToggle>
                  <IonItem routerLink="/support-line">
                    <IonIcon slot="start" icon={callOutline}></IonIcon>
                    <IonLabel>Support Line</IonLabel>
                  </IonItem>
                </IonMenuToggle>

                <IonMenuToggle>
                  <IonItem routerLink="/logout">
                    <IonIcon slot="start" icon={logOutOutline}></IonIcon>
                    <IonLabel>Logout</IonLabel>
                  </IonItem>
                </IonMenuToggle>
              </>
            ) : (
              <>
                <IonMenuToggle>
                  <IonItem routerLink="/how-to-sell">
                    <IonIcon slot="start" icon={cashOutline}></IonIcon>
                    <IonLabel>How To Sell</IonLabel>
                  </IonItem>
                </IonMenuToggle>

                <IonMenuToggle>
                  <IonItem routerLink="/how-to-buy">
                    <IonIcon slot="start" icon={basketOutline}></IonIcon>
                    <IonLabel>How To Buy</IonLabel>
                  </IonItem>
                </IonMenuToggle>

                <IonMenuToggle>
                  <IonItem routerLink="/support-line">
                    <IonIcon slot="start" icon={callOutline}></IonIcon>
                    <IonLabel>Support Line</IonLabel>
                  </IonItem>
                </IonMenuToggle>

                <IonMenuToggle>
                  <IonItem routerLink="/login">
                    <IonIcon slot="start" icon={lockClosedOutline}></IonIcon>
                    <IonLabel>Login</IonLabel>
                  </IonItem>
                </IonMenuToggle>
                <IonMenuToggle>
                  <IonItem routerLink="/register">
                    <IonIcon slot="start" icon={personCircleOutline}></IonIcon>
                    <IonLabel>Register</IonLabel>
                  </IonItem>
                </IonMenuToggle>
              </>
            )}
          </IonList>
        </IonContent>
      </IonMenu>
      <IonPage id="main-content">
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton></IonMenuButton>
            </IonButtons>
            {isPlatform("ios") ? (
              <IonTitle>Paau Market</IonTitle>
            ) : (
              <IonSearchbar
                value={search}
                debounce={500}
                onIonInput={(ev) => setSearch(ev.target.value)}
                showClearButton="always"
                placeholder="Search Paau Market"
                maxlength={30}
              />
            )}

            <IonButtons slot="end">
              <IonButton routerLink={"/app/me"} fill="clear" color={"primary"}>
                <IonIcon icon={personCircleOutline} size="large" />
              </IonButton>
            </IonButtons>
          </IonToolbar>
          {isPlatform("ios") ? (
            <IonToolbar>
              <IonSearchbar
                value={search}
                debounce={500}
                onIonInput={(ev) => setSearch(ev.target.value)}
                showClearButton="always"
                placeholder="Search Paau Market"
                maxlength={30}
              />
            </IonToolbar>
          ) : null}
        </IonHeader>

        <IonContent>
          <IonGrid>
            <IonRow>
              <IonCol>
                <IonButton expand="block" routerLink="/app/sell">
                  <IonIcon icon={addCircleOutline} slot="start" />
                  <div>Post ad</div>
                </IonButton>
              </IonCol>
              <IonCol>
                <IonButton
                  color="tertiary"
                  expand="block"
                  routerLink="/app/requests"
                >
                  <IonIcon icon={megaphoneOutline} slot="start" />
                  Request Ad
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>

          <IonGrid>
            <IonRow className="ion-justify-content-center">
              <IonCol size="12" sizeLg="4" sizeXl="3" className="p-0">
                {!search ? (
                  <>
                    {/* <IonText>
                      <h4 className="font-bold max-lg:text-center ion-padding ion-no-margin">
                        All category
                      </h4>
                    </IonText> */}

                    <Category />
                  </>
                ) : null}
              </IonCol>
              <IonCol>
                <IonText>
                  <h4 className="font-bold ion-padding ion-no-margin">
                    {search ? `Search: ${search}` : "Trending ads"}
                  </h4>
                </IonText>

                <AdvertList
                  isPending={isPending}
                  isSuccess={isSuccess}
                  data={data}
                />
              </IonCol>
            </IonRow>
          </IonGrid>
          <Refresher refresh={refetch} />
          <InfiniteScroll
            hasNextPage={hasNextPage}
            fetchNextPage={fetchNextPage}
            isFetchingNextPage={isFetchingNextPage}
          />
        </IonContent>
      </IonPage>
    </>
  );
}

const Category = () => {
  const { isPending, isSuccess, data } = useQuery({
    queryKey: ["categories", "index"],
    queryFn: ({ signal }) =>
      api.get("/categories", { signal }).then((response) => response.data),
  });

  return isPending ? (
    <div className="ion-text-center">
      <IonSpinner />
    </div>
  ) : isSuccess ? (
    <IonGrid className="px-0">
      <IonRow className="ion-justify-content-center">
        {data.map((category) => (
          <IonCol
            key={category["id"]}
            size="4"
            sizeSm="3"
            sizeMd="2"
            sizeLg="12"
          >
            <IonCard
              className="flex flex-col justify-center w-full h-full ion-no-margin"
              routerLink={generatePath("/app/adverts/categories/:category", {
                category: category["slug"],
              })}
            >
              <IonCardContent
                className={clsx(
                  "p-2",
                  "flex flex-col items-center justify-center text-center",
                  "lg:flex-row lg:text-start lg:gap-2 lg:justify-start"
                )}
              >
                <IonThumbnail className="[--size:theme(spacing.10)]">
                  <img
                    src={category["image"]?.["cache"]?.["extra-small"]}
                    alt={category["name"]}
                    className="object-cover object-center w-full h-full"
                  />
                </IonThumbnail>
                <div className="max-lg:text-xs">
                  <IonText color={"dark"}>{category["name"]}</IonText>
                </div>
              </IonCardContent>
            </IonCard>
          </IonCol>
        ))}
      </IonRow>
    </IonGrid>
  ) : null;
};
