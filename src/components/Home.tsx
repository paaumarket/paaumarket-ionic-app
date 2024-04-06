import React from "react";
import { IonItem, IonInput, IonPage } from "@ionic/react";

export default function Home() {
  return (
    <IonPage>
      <div className="ion-padding-top ion-padding-end">
        <IonInput
          label="Outline input"
          labelPlacement="floating"
          fill="outline"
          placeholder="Enter text"
        ></IonInput>
      </div>
    </IonPage>
  );
}
