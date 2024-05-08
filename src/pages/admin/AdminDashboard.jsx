import useAuth from "@/hooks/useAuth";
import api from "@/lib/api";
import {
  IonBackButton,
  IonBadge,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonRow,
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useQuery } from "@tanstack/react-query";
import { folderOutline, megaphoneOutline, personOutline } from "ionicons/icons";

const AdminDashboard = () => {
  const { user } = useAuth();

  const { isPending, isSuccess, data } = useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: ({ signal }) =>
      api.get("/admin/dashboard", { signal }).then((response) => response.data),
  });

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
        {isPending ? (
          <div className="ion-text-center ion-margin">
            <IonSpinner />
          </div>
        ) : isSuccess ? (
          <IonGrid>
            <IonRow>
              <IonCol>
                <IonCard className="h-full m-0">
                  <IonCardHeader>
                    <IonCardTitle className="text-lg font-bold">
                      Users
                    </IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <div className="flex flex-col gap-1 truncate">
                      <IonText color={"success"}>
                        {data["users_count"]} - All Users
                      </IonText>
                    </div>
                  </IonCardContent>
                </IonCard>
              </IonCol>
              <IonCol>
                <IonCard className="h-full m-0">
                  <IonCardHeader>
                    <IonCardTitle className="text-lg font-bold">
                      Adverts
                    </IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <div className="flex flex-col gap-1 truncate">
                      <IonText color={"success"}>
                        {data["adverts_count"]["approved"] || 0} - Approved
                      </IonText>
                      <IonText color={"warning"}>
                        {data["adverts_count"]["reviewing"] || 0} - Reviewing
                      </IonText>
                      <IonText color={"danger"}>
                        {data["adverts_count"]["declined"] || 0} - Declined
                      </IonText>
                    </div>
                  </IonCardContent>
                </IonCard>
              </IonCol>
            </IonRow>
          </IonGrid>
        ) : null}
        <IonList inset>
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
