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
  useIonModal,
} from "@ionic/react";
import { useQuery } from "@tanstack/react-query";
import { add } from "ionicons/icons";
import AdminCategoryFormModal from "./AdminCategoryFormModal";
import { useHistory } from "react-router-dom";

const AdminCategories = () => {
  const history = useHistory();
  const [present, dismiss] = useIonModal(AdminCategoryFormModal, {
    onCancelled: () => dismiss(),
    onSuccess: (category) => {
      dismiss();
      history.push(`/admin/categories/${category.slug}`);
    },
  });

  const { isPending, isSuccess, data } = useQuery({
    queryKey: ["categories", "index"],
    queryFn: ({ signal }) =>
      api.get("/categories", { signal }).then((response) => response.data),
  });

  const openAddCategoryModal = () => present();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/admin" />
          </IonButtons>
          <IonTitle>Categories</IonTitle>
        </IonToolbar>
        <IonToolbar>
          <IonSearchbar></IonSearchbar>
        </IonToolbar>
      </IonHeader>

      {/* Page content */}
      <IonContent fullscreen>
        {isPending ? (
          <div className="ion-padding ion-text-center">
            <IonSpinner />
          </div>
        ) : null}
        {isSuccess ? (
          <IonList>
            {data.map((category) => (
              <IonItem
                key={category["id"]}
                routerLink={`/admin/categories/${category["slug"]}`}
              >
                <IonThumbnail
                  slot="start"
                  className="[--size:theme(spacing.10)]"
                >
                  <img
                    alt={category["name"]}
                    src={category["image"]?.["cache"]?.["extra-small"]}
                  />
                </IonThumbnail>
                <IonLabel>{category["name"]}</IonLabel>
              </IonItem>
            ))}
          </IonList>
        ) : null}
      </IonContent>

      {/* Add Button */}
      <IonFab slot="fixed" vertical="bottom" horizontal="end">
        <IonFabButton aria-label="Add Category" onClick={openAddCategoryModal}>
          <IonIcon icon={add}></IonIcon>
        </IonFabButton>
      </IonFab>
    </IonPage>
  );
};

export default AdminCategories;
