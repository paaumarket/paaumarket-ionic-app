import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonText,
  IonToolbar,
} from "@ionic/react";

// Logo Image
import logo from "../assets/paaumarket.svg";
import SignInForm from "@/component/SignInForm";

const SignIn = ({ history }) => {
  return (
    <IonPage>
      <IonHeader className="shadow-none">
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/"></IonBackButton>
          </IonButtons>
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
            <h2 className="ion-no-margin font-bold text-center text-md">
              Welcome back to PAAU Market
            </h2>
          </IonText>
        </div>

        <SignInForm onSuccess={() => history.replace("/home")} />
      </IonContent>
    </IonPage>
  );
};

export default SignIn;
