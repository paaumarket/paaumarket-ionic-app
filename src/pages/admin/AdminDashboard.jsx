import useAuth from "@/hooks/useAuth";
import {
  IonBackButton,
  IonBadge,
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
  const { user } = useAuth();
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

            {user?.["admin"]["reviewing_adverts_count"] ? (
              <IonBadge color={"warning"}>
                {user?.["admin"]["reviewing_adverts_count"]}
              </IonBadge>
            ) : null}
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
