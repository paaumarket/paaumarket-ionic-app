import React from "react";

import { IonContent, IonIcon, IonPage, IonText } from "@ionic/react";
import { alertCircleOutline } from "ionicons/icons";

export default function AboutUs() {
  return (
    <IonPage>
      <IonContent className="ion-padding" fullscreen>
        <div className="mt-10"></div>
        <IonText>
          <div className="text-center">
            <IonIcon size="large" icon={alertCircleOutline}></IonIcon>
            <h2 className="text-center">
              <b>About Us</b>
            </h2>

            <p>
              <IonText color="medium">
                PAAU Market is a one-stop marketplace for students of Prince
                Audu Abubakar University (PAAU), Anyigba, Kogi State.
              </IonText>
            </p>
          </div>
        </IonText>

        <div className="mt-5">
          <p className="text-center text-pink-500 text-3xl">
            Under Construction
          </p>
        </div>
      </IonContent>
    </IonPage>
  );
}
