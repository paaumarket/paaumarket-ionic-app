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
            <IonBackButton defaultHref="/app/me" />
          </IonButtons>
          <IonTitle>Admin</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonList>
          {/* Categories */}
          <IonItem routerLink="/app/me/admin/categories">
            <IonIcon
              aria-hidden="true"
              icon={folderOutline}
              slot="start"
              color="primary"
            ></IonIcon>
            <IonLabel>Categories</IonLabel>
          </IonItem>

          {/* Adverts */}
          <IonItem routerLink="/app/me/admin/adverts">
            <IonIcon
              aria-hidden="true"
              icon={megaphoneOutline}
              slot="start"
              color="primary"
            ></IonIcon>
            <IonLabel>Adverts</IonLabel>

            {user?.["admin"]?.["reviewing_adverts_count"] ? (
              <IonBadge color={"danger"}>
                {user?.["admin"]?.["reviewing_adverts_count"]}
              </IonBadge>
            ) : null}
          </IonItem>

          {/* Users */}
          <IonItem routerLink="/app/me/admin/users">
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
