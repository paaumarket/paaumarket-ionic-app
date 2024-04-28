import useAuth from "@/hooks/useAuth";
import {
  IonAvatar,
  IonBadge,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonItemGroup,
  IonLabel,
  IonList,
  IonListHeader,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import {
  callOutline,
  createOutline,
  mailOutline,
  personOutline,
  storefrontOutline,
  walletOutline,
} from "ionicons/icons";

import DefaultUserImage from "@/assets/user@100.png";

export default function Profile() {
  const { user } = useAuth();
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Profile</IonTitle>
          <IonButtons slot="primary">
            <IonButton routerLink={"/home/profile/edit"}>
              <IonIcon slot="icon-only" icon={createOutline}></IonIcon>
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col items-center justify-center gap-4">
            <IonAvatar className="w-20 h-20">
              <img
                src={
                  user["profile_photo"]?.["cache"]?.["small"] ||
                  DefaultUserImage
                }
                alt={user["name"]}
              />
            </IonAvatar>
            <h1 className="m-0 font-bold text-center">{user["name"]}</h1>
          </div>

          <IonList>
            <IonItem>
              <IonIcon
                icon={walletOutline}
                size="large"
                slot="start"
                color={"primary"}
              />

              <IonLabel>
                <h3>
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
                <p>
                  <IonText color="medium">MY BALANCE</IonText>
                </p>
              </IonLabel>

              <IonButton
                slot="end"
                size="small"
                routerLink="/home/profile/top-up"
              >
                Add Fund
              </IonButton>
            </IonItem>

            <IonItem routerLink="/home/profile/my-adverts">
              <IonIcon
                icon={storefrontOutline}
                size="large"
                slot="start"
                color={"primary"}
              />

              <IonLabel>
                <h3>
                  <IonText color={"primary"}>My Ads</IonText>
                </h3>
                <p>SEE ADS</p>
              </IonLabel>
            </IonItem>
          </IonList>

          <IonList>
            <IonListHeader>
              <IonLabel>Profile</IonLabel>
            </IonListHeader>
            <IonItemGroup>
              <IonItem>
                <IonIcon slot="start" color={"tertiary"} icon={personOutline} />
                <IonLabel>{user["name"]}</IonLabel>
              </IonItem>
              <IonItem>
                <IonIcon slot="start" color={"tertiary"} icon={mailOutline} />
                <IonLabel>{user["email"]}</IonLabel>
              </IonItem>
              <IonItem>
                <IonIcon slot="start" color={"tertiary"} icon={callOutline} />
                <IonLabel>{user["mobile_number"]}</IonLabel>
              </IonItem>
            </IonItemGroup>
          </IonList>

          <IonList className="ion-margin-top">
            <IonItemGroup>
              {user["permissions"].includes("access-dashboard") ? (
                <IonItem routerLink="/admin">
                  <IonLabel>Admin Panel</IonLabel>
                  {user?.["admin"]?.["reviewing_adverts_count"] ? (
                    <IonBadge color={"warning"}>
                      {user?.["admin"]?.["reviewing_adverts_count"]}
                    </IonBadge>
                  ) : null}
                </IonItem>
              ) : null}
              <IonItem routerLink="/logout">
                <IonLabel>Logout</IonLabel>
              </IonItem>
            </IonItemGroup>
          </IonList>
        </div>
      </IonContent>
    </IonPage>
  );
}
