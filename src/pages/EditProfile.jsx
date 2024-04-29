import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { imageOutline, lockClosedOutline, personOutline } from "ionicons/icons";

const EditProfile = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home/profile" />
          </IonButtons>
          <IonTitle>Edit Profile</IonTitle>
        </IonToolbar>
      </IonHeader>

      {/* Page content */}
      <IonContent fullscreen>
        <IonList>
          <IonItem routerLink="/home/profile/edit/photo">
            <IonIcon slot="start" icon={imageOutline} color="primary" />
            <IonLabel>Photo</IonLabel>
          </IonItem>
          <IonItem routerLink="/home/profile/edit/details">
            <IonIcon slot="start" icon={personOutline} color="primary" />
            <IonLabel>Profile Details</IonLabel>
          </IonItem>
          <IonItem routerLink="/home/profile/edit/password">
            <IonIcon slot="start" icon={lockClosedOutline} color="primary" />
            <IonLabel>Password</IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default EditProfile;
