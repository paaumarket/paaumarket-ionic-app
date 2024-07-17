import withIonPageQueryRefetch from "@/hoc/withIonPageQueryRefetch";
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { alertCircleOutline } from "ionicons/icons";

export default withIonPageQueryRefetch(function AboutUs() {
  return (
    <IonPage>
      <IonHeader className="shadow-none">
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/app"></IonBackButton>
          </IonButtons>
          <IonTitle>About</IonTitle>
        </IonToolbar>
      </IonHeader>

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
          <p className="text-3xl text-center text-pink-500">
            Under Construction
          </p>
        </div>
      </IonContent>
    </IonPage>
  );
});
