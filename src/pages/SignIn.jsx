import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";

// Logo Image
import logo from "@/assets/paaumarket.svg";
import SignInForm from "@/components/SignInForm";
import { useHistory } from "react-router-dom";
import withIonPageQueryRefetch from "@/hoc/withIonPageQueryRefetch";

const SignIn = () => {
  const history = useHistory();
  return (
    <IonPage>
      <IonHeader className="shadow-none">
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/app"></IonBackButton>
          </IonButtons>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <div className="flex flex-col items-center justify-center gap-4 p-4">
          <img
            src={logo}
            alt="Paau Market Logo"
            className="w-20 h-20 mx-auto mt-10"
          />
          <IonText className="ion-text-color">
            <h2 className="font-light text-center ion-no-margin text-md">
              Welcome back to PAAU Market
            </h2>
          </IonText>
        </div>

        <SignInForm onSuccess={() => history.replace("/app")} />
      </IonContent>
    </IonPage>
  );
};

export default withIonPageQueryRefetch(SignIn);
