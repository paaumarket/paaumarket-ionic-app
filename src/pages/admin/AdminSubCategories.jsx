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
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { add } from "ionicons/icons";
import { useRouteMatch } from "react-router-dom";
import AdminCategoriesAddModal from "./AdminCategoriesAddModal";

const AdminSubCategories = () => {
  const match = useRouteMatch();

  const queryKey = ["category", match.params.category];
  const {
    isPending,
    isSuccess,
    data: category,
  } = useQuery({
    queryKey,
    queryFn: ({ signal }) =>
      api
        .get(`/categories/${match.params.category}`, { signal })
        .then((response) => response.data),
  });

  const queryClient = useQueryClient();

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

  const [present, dismiss] = useIonModal(AdminCategoriesAddModal, {
    parent: category,
    onCancelled: () => dismiss(),
    onSuccess: (subCategory) => {
      dismiss();
      queryClient.refetchQueries({
        queryKey,
      });
    },
  });

  const openAddSubCategoryModal = () => present();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/admin/categories" />
          </IonButtons>

          <IonTitle>
            {isPending ? "Loading..." : category["name"]}
            {isSuccess ? (
              <IonThumbnail className="[--size:theme(spacing.9)] inline-block align-middle ion-margin-start">
                <img
                  alt={category["name"]}
                  src={category["image"] ? category["image"]["src"] : null}
                />
              </IonThumbnail>
            ) : null}
          </IonTitle>
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
                <IonLabel>
                  <h4>{category["name"]}</h4>
                  <p>₦{category["cost"]}</p>
                </IonLabel>
              </IonItem>
            ))}
          </IonList>
        ) : null}
      </IonContent>

      {/* Add */}
      {isSuccess ? (
        <IonFab slot="fixed" vertical="bottom" horizontal="end">
          <IonFabButton
            aria-label="Add Category"
            onClick={openAddSubCategoryModal}
          >
            <IonIcon icon={add}></IonIcon>
          </IonFabButton>
        </IonFab>
      ) : null}
    </IonPage>
  );
};

export default AdminSubCategories;
