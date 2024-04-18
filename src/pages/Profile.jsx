import Header from "@/component/Header";
import { IonBackButton, IonButtons, IonContent, IonPage } from "@ionic/react";
import React from "react";

export default function Profile() {
  return (
    <IonPage>
      <Header>
        <IonButtons slot="start">
          <IonBackButton defaultHref="/"></IonBackButton>
        </IonButtons>
        <div className="grow ion-padding-start">
          <img
            src="https://w7.pngwing.com/pngs/722/101/png-transparent-computer-icons-user-profile-circle-abstract-miscellaneous-rim-account-thumbnail.png"
            alt=""
            className="max-w-7 max-h-7 inline-block rounded-full"
          />{" "}
          Abel Emmanuel
        </div>
      </Header>
      <IonContent className="ion-padding-start ion-padding-end">
        <h1>Hello world</h1>
      </IonContent>
    </IonPage>
  );
}
