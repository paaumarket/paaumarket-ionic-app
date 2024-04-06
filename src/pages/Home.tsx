import { IonButton, IonContent, IonPage, IonText } from "@ionic/react";

export default function Home() {
  return (
    <IonPage>
      <IonContent>
        <IonText>Welcome to PaauMarket</IonText>
        <p>
          <IonButton routerLink="/login" expand="block">
            Login
          </IonButton>
          <IonButton routerLink="/register" expand="block" color="dark">
            Register
          </IonButton>
        </p>
      </IonContent>
    </IonPage>
  );
}
