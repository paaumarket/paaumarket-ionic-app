import withIonPageQueryRefetch from "@/hoc/withIonPageQueryRefetch";
import { useApiQuery } from "@/hooks/useApiQuery";
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
  IonItemGroup,
  IonLabel,
  IonList,
  IonListHeader,
  IonPage,
  IonRow,
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import {
  alertOutline,
  chevronCollapseOutline,
  folderOutline,
  megaphoneOutline,
  personOutline,
  skullOutline,
  telescopeOutline,
} from "ionicons/icons";

const AdminDashboard = () => {
  const { user } = useAuth();

  const { isPending, isSuccess, data } = useApiQuery({
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

              {/* Adverts */}
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

              {/* Demands */}
              <IonCol>
                <IonCard className="h-full m-0">
                  <IonCardHeader>
                    <IonCardTitle className="text-lg font-bold">
                      Demands
                    </IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <div className="flex flex-col gap-1 truncate">
                      <IonText color={"success"}>
                        {data["demands_count"]["approved"] || 0} - Approved
                      </IonText>
                      <IonText color={"warning"}>
                        {data["demands_count"]["reviewing"] || 0} - Reviewing
                      </IonText>
                      <IonText color={"danger"}>
                        {data["demands_count"]["declined"] || 0} - Declined
                      </IonText>
                    </div>
                  </IonCardContent>
                </IonCard>
              </IonCol>

              {/* Submissions */}
              <IonCol>
                <IonCard className="h-full m-0">
                  <IonCardHeader>
                    <IonCardTitle className="text-lg font-bold">
                      Submissions
                    </IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <div className="flex flex-col gap-1 truncate">
                      <IonText color={"success"}>
                        {data["submissions_count"]["approved"] || 0} - Approved
                      </IonText>
                      <IonText color={"warning"}>
                        {data["submissions_count"]["reviewing"] || 0} -
                        Reviewing
                      </IonText>
                      <IonText color={"danger"}>
                        {data["submissions_count"]["declined"] || 0} - Declined
                      </IonText>
                    </div>
                  </IonCardContent>
                </IonCard>
              </IonCol>
            </IonRow>
          </IonGrid>
        ) : null}

        <IonList inset>
          <IonListHeader>
            <IonLabel>Marketplace</IonLabel>
          </IonListHeader>

          <IonItemGroup>
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

            {/* Demands */}
            <IonItem routerLink="/app/me/admin/demands">
              <IonIcon
                aria-hidden="true"
                icon={telescopeOutline}
                slot="start"
                color="primary"
              ></IonIcon>
              <IonLabel>Demands</IonLabel>

              {user?.["admin"]?.["reviewing_demands_count"] ? (
                <IonBadge color={"danger"}>
                  {user?.["admin"]?.["reviewing_demands_count"]}
                </IonBadge>
              ) : null}
            </IonItem>

            {/* Submissions */}
            <IonItem routerLink="/app/me/admin/submissions">
              <IonIcon
                aria-hidden="true"
                icon={chevronCollapseOutline}
                slot="start"
                color="primary"
              ></IonIcon>
              <IonLabel>Submissions</IonLabel>

              {user?.["admin"]?.["reviewing_submissions_count"] ? (
                <IonBadge color={"danger"}>
                  {user?.["admin"]?.["reviewing_submissions_count"]}
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
          </IonItemGroup>
        </IonList>

        <IonList inset>
          <IonListHeader>
            <IonLabel>System</IonLabel>
          </IonListHeader>
          <IonItemGroup>
            {/* Notifications */}
            <IonItem routerLink="/app/me/admin/notifications">
              <IonIcon
                aria-hidden="true"
                icon={alertOutline}
                slot="start"
                color="primary"
              ></IonIcon>
              <IonLabel>System Notifications</IonLabel>
            </IonItem>

            {/* Command */}
            <IonItem routerLink="/app/me/admin/command">
              <IonIcon
                aria-hidden="true"
                icon={skullOutline}
                slot="start"
                color="primary"
              ></IonIcon>
              <IonLabel>System Command</IonLabel>
            </IonItem>
          </IonItemGroup>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default withIonPageQueryRefetch(AdminDashboard);
