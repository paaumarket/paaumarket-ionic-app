import DefaultUserImage from "@/assets/user-avatar.svg";
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
  megaphoneOutline,
  personOutline,
  storefrontOutline,
  walletOutline,
} from "ionicons/icons";

export default function Profile() {
  const { user } = useAuth();
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Profile</IonTitle>
          <IonButtons slot="primary">
            <IonButton routerLink={"/app/me/edit"}>
              <IonIcon slot="icon-only" icon={createOutline}></IonIcon>
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col items-center justify-center gap-4">
            <IonAvatar className="w-32 h-32">
              <img
                src={
                  user["profile_photo"]?.["cache"]?.["medium"] ||
                  DefaultUserImage
                }
                alt={user["name"]}
                className="object-cover object-center w-full h-full"
              />
            </IonAvatar>
            <h1 className="text-lg font-bold text-center ion-no-margin">
              {user["name"]}
            </h1>
          </div>

          <IonList>
            <IonItem>
              <IonIcon icon={walletOutline} slot="start" color={"primary"} />

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
                <p>MY BALANCE</p>
              </IonLabel>

              <IonButton slot="end" size="small" routerLink="/app/me/top-up">
                Add Fund
              </IonButton>
            </IonItem>

            <IonItem routerLink="/app/me/my-adverts">
              <IonIcon
                icon={storefrontOutline}
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

            <IonItem routerLink="/app/me/notifications">
              <IonIcon icon={megaphoneOutline} slot="start" color={"primary"} />

              <IonLabel color={"primary"}>Notifications</IonLabel>

              {user["unread_notifications_count"] ? (
                <IonBadge slot="end" color={"danger"}>
                  {user["unread_notifications_count"]}
                </IonBadge>
              ) : null}
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

          <IonList>
            <IonItemGroup>
              {user["permissions"].includes("access-dashboard") ? (
                <IonItem routerLink="/app/me/admin">
                  <IonLabel>Admin Panel</IonLabel>
                  {user?.["admin"]?.["reviewing_adverts_count"] ? (
                    <IonBadge color={"danger"}>
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
