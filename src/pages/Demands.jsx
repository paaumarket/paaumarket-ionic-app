import {
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";

export default function Demands() {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Demands</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {import.meta.env.DEV ? (
          <IonButton expand="block" routerLink="/app/demands/new">
            Create Demand
          </IonButton>
        ) : null}

        <p className="ion-text-center ion-padding">Under Construction</p>
      </IonContent>
    </IonPage>
  );
}
