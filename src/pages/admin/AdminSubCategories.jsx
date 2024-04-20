import api from "@/lib/api";
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonPage,
  IonSearchbar,
  IonSpinner,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useQuery } from "@tanstack/react-query";
import { add } from "ionicons/icons";
import { useRouteMatch } from "react-router-dom";

const AdminSubCategories = () => {
  const match = useRouteMatch();
  const { isPending, data } = useQuery({
    queryKey: ["category", match.params.category],
    queryFn: ({ signal }) =>
      api
        .get(`/categories/${match.params.category}`, { signal })
        .then((response) => response.data),
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/admin/categories" />
          </IonButtons>
          <IonTitle>{isPending ? "Loading..." : data["name"]}</IonTitle>
        </IonToolbar>
        <IonToolbar>
          <IonSearchbar></IonSearchbar>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>{isPending ? <IonSpinner /> : null}</IonContent>
      <IonFab slot="fixed" vertical="bottom" horizontal="end">
        <IonFabButton
          aria-label="Add Category"
          routerLink="/admin/categories/new"
        >
          <IonIcon icon={add}></IonIcon>
        </IonFabButton>
      </IonFab>
    </IonPage>
  );
};

export default AdminSubCategories;
