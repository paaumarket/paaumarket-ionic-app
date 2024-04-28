import useAuth from "@/hooks/useAuth";
import {
  IonBackButton,
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
  IonThumbnail,
  IonToolbar,
} from "@ionic/react";
import {
  callOutline,
  mailOutline,
  personOutline,
  storefrontOutline,
  walletOutline,
} from "ionicons/icons";

import DefaultUserImage from "@/assets/user@100.png";

export default function Profile() {
  const { user, permissions } = useAuth();
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/"></IonBackButton>
          </IonButtons>
          <div className="flex items-center gap-2 ion-padding-start">
            <IonThumbnail className="[--size:theme(spacing.8)]">
              <img
                src={user["profile_photo"]?.["src"] || DefaultUserImage}
                alt={user["name"]}
              />
            </IonThumbnail>
            {user["name"]}
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonItem>
          <IonIcon
            icon={walletOutline}
            size="large"
            slot="start"
            color={"primary"}
          />

          <IonLabel>
            <h3>
              <IonText>
                ₦{Intl.NumberFormat().format(user["wallet_balance"])}
              </IonText>
            </h3>
            <p>
              <IonText color="medium">MY BALANCE</IonText>
            </p>
          </IonLabel>

          <IonButton slot="end" size="small" routerLink="/home/profile/top-up">
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

        <IonList>
          <IonListHeader>
            <IonLabel>Profile</IonLabel>
          </IonListHeader>
          <IonItemGroup>
            <IonItem>
              <IonIcon slot="start" icon={personOutline} />
              <IonLabel>{user["name"]}</IonLabel>
            </IonItem>
            <IonItem>
              <IonIcon slot="start" icon={mailOutline} />
              <IonLabel>{user["email"]}</IonLabel>
            </IonItem>
            <IonItem>
              <IonIcon slot="start" icon={callOutline} />
              <IonLabel>{user["mobile_number"]}</IonLabel>
            </IonItem>
          </IonItemGroup>
        </IonList>

        <IonList className="ion-margin-top">
          <IonItemGroup>
            {permissions.includes("access-dashboard") ? (
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
      </IonContent>
    </IonPage>
  );
}
