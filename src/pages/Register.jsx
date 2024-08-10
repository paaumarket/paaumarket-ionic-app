// Logo Image
import logo from "@/assets/paaumarket.svg";
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
import { Link } from "react-router-dom";
import withIonPageQueryRefetch from "@/hoc/withIonPageQueryRefetch";
import RegisterForm from "@/components/RegisterForm";

const Register = () => {
  return (
    <IonPage>
      <IonHeader className="shadow-none">
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/app"></IonBackButton>
          </IonButtons>
          <IonTitle>Register</IonTitle>
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
              Sign up to PAAU Market
            </h2>
          </IonText>
        </div>

        {/*-------------------- Register Form----------------- */}
        <RegisterForm onSuccess={() => history.replace("/app")} />
        {/* --------------------END---------------- */}

        <IonText className="ion-text-center">
          <p>
            Already have an account? <Link to="/login">Sign In</Link>
          </p>
        </IonText>
      </IonContent>
    </IonPage>
  );
};

export default withIonPageQueryRefetch(Register);
