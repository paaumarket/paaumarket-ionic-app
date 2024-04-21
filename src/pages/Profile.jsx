import Header from "@/component/Header";
import useAuth from "@/hooks/useAuth";
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonText,
} from "@ionic/react";
import {
  callOutline,
  lockClosedOutline,
  mailOutline,
  pencilOutline,
  personOutline,
  storefrontOutline,
  walletOutline,
} from "ionicons/icons";
import { Link } from "react-router-dom";

export default function Profile() {
  const { user, permissions } = useAuth();
  return (
    <IonPage>
      <Header>
        <IonButtons slot="start">
          <IonBackButton defaultHref="/"></IonBackButton>
        </IonButtons>
        <div className="grow">
          <img
            src="https://w7.pngwing.com/pngs/722/101/png-transparent-computer-icons-user-profile-circle-abstract-miscellaneous-rim-account-thumbnail.png"
            alt=""
            className="inline-block rounded-full max-w-7 max-h-7"
          />{" "}
          {user["name"]}
        </div>
      </Header>
      <IonContent className="ion-padding-start ion-padding-end">
        <div className="flex items-center">
          <IonIcon
            icon={walletOutline}
            size="large"
            className="ion-padding"
          ></IonIcon>

          <div className="pr-5">
            <IonText>
              <h3>₦ {user["wallet_balance"]}</h3>
            </IonText>
            <p className="text-xs">
              <IonText color="medium">MY BALANCE</IonText>
            </p>
          </div>

          <div>
            <IonButton size="small">Add Fund</IonButton>
          </div>
        </div>

        <div>
          <Link to="#" className="flex">
            <IonIcon
              icon={storefrontOutline}
              size="large"
              className="ion-padding"
            ></IonIcon>

            <div>
              <IonText>
                <h3>My ads</h3>
              </IonText>

              <p className="text-xs">
                <IonText color="medium">SEE ADS</IonText>
              </p>
            </div>
          </Link>
        </div>

        <main className="pt-5">
          <section className="flex items-center py-2">
            <IonIcon
              icon={personOutline}
              className="ion-padding-end ion-no-padding"
            ></IonIcon>
            <p className=" grow">{user["name"]}</p>
            <IonIcon icon={pencilOutline}></IonIcon>
          </section>

          <section className="flex items-center py-2">
            <IonIcon
              icon={mailOutline}
              className="ion-padding-end ion-no-padding"
            ></IonIcon>
            <p className=" grow">{user["email"]}</p>
            <IonIcon color="medium" icon={lockClosedOutline}></IonIcon>
          </section>

          <section className="flex items-center py-2">
            <IonIcon icon={callOutline} className="ion-padding-end"></IonIcon>
            <p className="grow">{user["mobile_number"]}</p>
            <IonIcon icon={lockClosedOutline} color="medium"></IonIcon>
          </section>
        </main>

        <IonList>
          {permissions.includes("access-dashboard") ? (
            <IonItem routerLink="/admin">
              <IonLabel>Admin Panel</IonLabel>
            </IonItem>
          ) : null}

          <IonItem routerLink="/logout">
            <IonLabel>Logout</IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
}
