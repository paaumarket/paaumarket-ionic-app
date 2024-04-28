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
import { folderOutline, megaphoneOutline, personOutline } from "ionicons/icons";

const AdminDashboard = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home/profile" />
          </IonButtons>
          <IonTitle>Admin</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonList>
          {/* Categories */}
          <IonItem routerLink="/admin/categories">
            <IonIcon
              aria-hidden="true"
              icon={folderOutline}
              slot="start"
              color="primary"
            ></IonIcon>
            <IonLabel>Categories</IonLabel>
          </IonItem>

          {/* Adverts */}
          <IonItem routerLink="/admin/adverts">
            <IonIcon
              aria-hidden="true"
              icon={megaphoneOutline}
              slot="start"
              color="primary"
            ></IonIcon>
            <IonLabel>Adverts</IonLabel>
          </IonItem>

          {/* Users */}
          <IonItem routerLink="/admin/users">
            <IonIcon
              aria-hidden="true"
              icon={personOutline}
              slot="start"
              color="primary"
            ></IonIcon>
            <IonLabel>Users</IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default AdminDashboard;
