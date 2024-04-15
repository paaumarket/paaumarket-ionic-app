import {
  IonButton,
  IonContent,
  IonPage,
  IonSearchbar,
  IonText,
} from "@ionic/react";
import Header from "../component/Header";

export default function Home() {
  return (
    <IonPage>
      <Header></Header>

      <IonText className="ion-padding">Find anything in store.</IonText>

      <IonSearchbar
        showClearButton="focus"
        value=""
        placeholder="Search Paau Market"
      ></IonSearchbar>

      <IonContent className="ion-padding">
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
