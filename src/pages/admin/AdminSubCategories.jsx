import api from "@/lib/api";
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonSearchbar,
  IonSpinner,
  IonThumbnail,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useQuery } from "@tanstack/react-query";
import { add } from "ionicons/icons";
import { useRouteMatch } from "react-router-dom";

const AdminSubCategories = () => {
  const match = useRouteMatch();
  const {
    isPending,
    isSuccess,
    data: category,
  } = useQuery({
    queryKey: ["category", match.params.category],
    queryFn: ({ signal }) =>
      api
        .get(`/categories/${match.params.category}`, { signal })
        .then((response) => response.data),
  });

  const {
    isPending: isPendingChildren,
    isSuccess: isSuccessChildren,
    data: subCategories,
  } = useQuery({
    enabled: isSuccess,
    queryKey: ["category", match.params.category, "children"],
    queryFn: ({ signal }) =>
      api
        .get(`/categories/${match.params.category}/children`, { signal })
        .then((response) => response.data),
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/admin/categories" />
          </IonButtons>

          <IonTitle>{isPending ? "Loading..." : category["name"]}</IonTitle>
          {isSuccess ? (
            <IonThumbnail
              className="[--size:theme(spacing.10)] inline-block"
              slot="end"
            >
              <img
                alt={category["name"]}
                src={category["image"] ? category["image"]["src"] : null}
              />
            </IonThumbnail>
          ) : null}
        </IonToolbar>
        <IonToolbar>
          <IonSearchbar></IonSearchbar>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {isPending || isPendingChildren ? <IonSpinner /> : null}

        {isSuccessChildren ? (
          <IonList>
            {subCategories.map((category) => (
              <IonItem key={category["id"]}>
                <IonThumbnail
                  slot="start"
                  className="[--size:theme(spacing.10)]"
                >
                  <img
                    alt={category["name"]}
                    src={category["image"] ? category["image"]["src"] : null}
                  />
                </IonThumbnail>
                <IonLabel>{category["name"]}</IonLabel>
              </IonItem>
            ))}
          </IonList>
        ) : null}
      </IonContent>

      {/* Add */}
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
