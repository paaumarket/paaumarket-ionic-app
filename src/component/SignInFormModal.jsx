import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import SignInForm from "./SignInForm";

const SignInFormModal = ({ onCancelled, onSuccess }) => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton color="danger" onClick={onCancelled}>
              Cancel
            </IonButton>
          </IonButtons>
          <IonTitle>Sign In</IonTitle>
        </IonToolbar>
      </IonHeader>

      {/* Content */}
      <IonContent fullscreen>
        <SignInForm onSuccess={onSuccess} />
      </IonContent>
    </IonPage>
  );
};

export default SignInFormModal;
