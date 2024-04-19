import Header from "@/component/Header";
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonGrid,
  IonIcon,
  IonPage,
  IonRow,
  IonText,
} from "@ionic/react";
import {
  callOutline,
  clipboardOutline,
  mailOutline,
  pencilOutline,
  personCircleOutline,
  personOutline,
  storefrontOutline,
  walletOutline,
} from "ionicons/icons";
import React from "react";
import { Link } from "react-router-dom";

export default function Profile() {
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
            className="max-w-7 max-h-7 inline-block rounded-full"
          />{" "}
          Abel Emmanuel
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
              <h3>₦ {0}</h3>
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
                <IonText color="medium">SEE YOUR ADS</IonText>
              </p>
            </div>
          </Link>
        </div>

        <main className="pt-5">
          <section className="flex py-2 items-center">
            <IonIcon
              icon={personOutline}
              className="ion-padding-end ion-no-padding"
            ></IonIcon>
            <p className=" grow">Abel Emmanuel</p>
            <IonIcon icon={pencilOutline}></IonIcon>
          </section>

          <section className="flex py-2 items-center">
            <IonIcon
              icon={mailOutline}
              className="ion-padding-end ion-no-padding"
            ></IonIcon>
            <p className=" grow">mannydev02@gmail.com</p>
            <IonIcon icon={pencilOutline}></IonIcon>
          </section>

          <section className="flex py-2 items-center">
            <IonIcon icon={callOutline} className="ion-padding-end"></IonIcon>
            <p className="grow">+234 09025534431</p>
            <IonIcon icon={pencilOutline}></IonIcon>
          </section>
        </main>
      </IonContent>
    </IonPage>
  );
}
