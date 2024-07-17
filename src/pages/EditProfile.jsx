import withIonPageQueryRefetch from "@/hoc/withIonPageQueryRefetch";
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

const EditProfile = withIonPageQueryRefetch(() => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/app/me" />
          </IonButtons>
          <IonTitle>Edit Profile</IonTitle>
        </IonToolbar>
      </IonHeader>

      {/* Page content */}
      <IonContent fullscreen>
        <IonList>
          <IonItem routerLink="/app/me/edit/photo">
            <IonIcon slot="start" icon={imageOutline} color="primary" />
            <IonLabel>Photo</IonLabel>
          </IonItem>
          <IonItem routerLink="/app/me/edit/details">
            <IonIcon slot="start" icon={personOutline} color="primary" />
            <IonLabel>Profile Details</IonLabel>
          </IonItem>
          <IonItem routerLink="/app/me/edit/password">
            <IonIcon slot="start" icon={lockClosedOutline} color="primary" />
            <IonLabel>Password</IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
});

export default EditProfile;
