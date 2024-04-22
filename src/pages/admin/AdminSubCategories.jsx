import api from "@/lib/api";
import {
  IonBackButton,
  IonButton,
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
  useIonActionSheet,
  useIonAlert,
  useIonLoading,
  useIonModal,
  useIonToast,
} from "@ionic/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  add,
  create,
  ellipsisHorizontal,
  ellipsisVertical,
  trashBin,
} from "ionicons/icons";
import { useRouteMatch } from "react-router-dom";
import { useHistory } from "react-router";
import clsx from "clsx";
import AdminCategoryFormModal from "./AdminCategoryFormModal";

const AdminSubCategories = () => {
  const history = useHistory();

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

  const categoryDeleteMutation = useCategoryDeleteMutation(category?.["slug"]);

  const openDeleteAlert = useDeleteAlert({
    header: category?.["name"],
    onDelete: () => categoryDeleteMutation.mutateAsync(),
    onSuccess: () => history.replace("/admin/categories"),
  });

  const [presentEditCategoryModal, dismissEditCategoryModal] = useIonModal(
    AdminCategoryFormModal,
    {
      edit: true,
      category,
      onCancelled: () => dismissEditCategoryModal(),
      onSuccess: (category) => {
        dismissEditCategoryModal();
        history.replace("/admin/categories/" + category["slug"]);
      },
    }
  );

  const openEditCategoryModal = () => presentEditCategoryModal();

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
              <IonThumbnail
                className={clsx(
                  "[--size:theme(spacing.9)]",
                  "inline-block align-middle",
                  "ion-margin-start"
                )}
              >
                <img
                  alt={category["name"]}
                  src={category["image"] ? category["image"]["src"] : null}
                />
              </IonThumbnail>
            ) : null}
          </IonTitle>

          {isSuccess ? (
            <IonButtons slot="primary">
              <IonButton onClick={openEditCategoryModal}>
                <IonIcon slot="icon-only" icon={create}></IonIcon>
              </IonButton>
              <IonButton onClick={openDeleteAlert}>
                <IonIcon slot="icon-only" icon={trashBin}></IonIcon>
              </IonButton>
            </IonButtons>
          ) : null}
        </IonToolbar>
        <IonToolbar>
          <IonSearchbar></IonSearchbar>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {isPending ? (
          <div className="ion-padding ion-text-center">
            <IonSpinner />
          </div>
        ) : isSuccess ? (
          <SubCategoryList category={category} />
        ) : null}
      </IonContent>
    </IonPage>
  );
};

const SubCategoryList = ({ category }) => {
  const queryClient = useQueryClient();

  const queryKey = ["category", category["slug"], "children"];

  const {
    isPending,
    isSuccess,
    data: subCategories,
  } = useQuery({
    queryKey,
    queryFn: ({ signal }) =>
      api
        .get(`/categories/${category["slug"]}/children`, { signal })
        .then((response) => response.data),
  });

  const [presentAddSubCategoryModal, dismissAddSubCategoryModal] = useIonModal(
    AdminCategoryFormModal,
    {
      parent: category["id"],
      onCancelled: () => dismissAddSubCategoryModal(),
      onSuccess: () => {
        dismissAddSubCategoryModal();
        queryClient.refetchQueries({
          queryKey,
        });
      },
    }
  );

  const openAddSubCategoryModal = () => presentAddSubCategoryModal();

  return (
    <>
      {isPending ? (
        <div className="ion-padding ion-text-center">
          <IonSpinner />
        </div>
      ) : isSuccess ? (
        <IonList>
          {subCategories.map((category) => (
            <SubCategoryItem
              key={category["id"]}
              category={category}
              onDelete={() =>
                queryClient.refetchQueries({
                  queryKey,
                })
              }
            />
          ))}
        </IonList>
      ) : null}

      <IonFab slot="fixed" vertical="bottom" horizontal="end">
        <IonFabButton
          aria-label="Add Category"
          onClick={openAddSubCategoryModal}
        >
          <IonIcon icon={add}></IonIcon>
        </IonFabButton>
      </IonFab>
    </>
  );
};

const SubCategoryItem = ({ category, onDelete }) => {
  const deleteMutation = useCategoryDeleteMutation(category["slug"]);

  const deleteAlert = useDeleteAlert({
    header: category["name"],
    onDelete: () => deleteMutation.mutateAsync(),
    onSuccess: onDelete,
  });

  const [presentActionSheet, dismissActionSheet] = useIonActionSheet();

  const openActions = () =>
    presentActionSheet({
      buttons: [
        {
          text: "Edit",
          data: {
            action: "edit",
          },
        },
        {
          text: "Delete",
          role: "destructive",
          data: {
            action: "delete",
          },
          handler: () => {
            deleteAlert();
          },
        },
        {
          text: "Cancel",
          role: "cancel",
          data: {
            action: "cancel",
          },
        },
      ],
    });

  return (
    <IonItem>
      <IonThumbnail slot="start" className="[--size:theme(spacing.10)]">
        <img
          alt={category["name"]}
          src={category["image"] ? category["image"]["src"] : null}
        />
      </IonThumbnail>
      <IonLabel>
        <h4>{category["name"]}</h4>
        <p>₦{category["cost"]}</p>
      </IonLabel>

      <IonButton onClick={openActions}>
        <IonIcon ios={ellipsisHorizontal} md={ellipsisVertical}></IonIcon>
      </IonButton>
    </IonItem>
  );
};

const useCategoryDeleteMutation = (category) =>
  useMutation({
    mutationKey: ["category", category, "delete"],
    mutationFn: () =>
      api.delete(`/categories/${category}`).then((response) => response.data),
  });

const useDeleteAlert = ({ header = "", message = "", onDelete, onSuccess }) => {
  const [presentToast, dismissToast] = useIonToast();
  const [presentAlert, dismissAlert] = useIonAlert();
  const [presentLoading, dismissLoading] = useIonLoading();

  return () =>
    presentAlert({
      header: header,
      subHeader: "Delete",
      message: message || "Are you sure you want to delete this item?",
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
        },
        {
          text: "OK",
          role: "confirm",
          handler: () => {
            presentLoading("Deleting....")
              .then(onDelete)
              .then(() => {
                presentToast({
                  message: "Successfully deleted.",
                  color: "success",
                  duration: 2000,
                });
              })
              .then(onSuccess)
              .catch(() =>
                presentToast({
                  message: "Failed to delete...",
                  color: "danger",
                  duration: 2000,
                })
              )

              .finally(() => dismissLoading());
          },
        },
      ],
    });
};

export default AdminSubCategories;
