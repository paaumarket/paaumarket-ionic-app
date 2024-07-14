import DefaultCategoryImage from "@/assets/category.svg";
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
  useIonModal,
} from "@ionic/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  add,
  createOutline,
  ellipsisHorizontal,
  ellipsisVertical,
  trashBinOutline,
} from "ionicons/icons";
import { useRouteMatch } from "react-router-dom";
import { useHistory } from "react-router";
import clsx from "clsx";
import AdminCategoryFormModal from "./AdminCategoryFormModal";
import useDeleteAlert from "@/hooks/useDeleteAlert";

const AdminSubCategories = () => {
  const history = useHistory();

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

  const categoryDeleteMutation = useCategoryDeleteMutation(category?.["slug"]);

  const openDeleteAlert = useDeleteAlert({
    title: category?.["name"],
    onDelete: () => categoryDeleteMutation.mutateAsync(),
    onSuccess: () => history.replace("/app/me/admin/categories"),
  });

  const [presentEditCategoryModal, dismissEditCategoryModal] = useIonModal(
    AdminCategoryFormModal,
    {
      edit: true,
      category,
      onCancelled: () => dismissEditCategoryModal(),
      onSuccess: (category) => {
        dismissEditCategoryModal();
        history.replace("/app/me/admin/categories/" + category["slug"]);
      },
    }
  );

  const openEditCategoryModal = () => presentEditCategoryModal();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/app/me/admin/categories" />
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
                  src={
                    category["image"]?.["cache"]?.["extra-small"] ||
                    DefaultCategoryImage
                  }
                  className="object-cover object-center w-full h-full"
                />
              </IonThumbnail>
            ) : null}
          </IonTitle>

          {isSuccess ? (
            <IonButtons slot="primary">
              <IonButton onClick={openEditCategoryModal}>
                <IonIcon slot="icon-only" icon={createOutline}></IonIcon>
              </IonButton>
              <IonButton onClick={openDeleteAlert}>
                <IonIcon slot="icon-only" icon={trashBinOutline}></IonIcon>
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
  const {
    isPending,
    isSuccess,
    data: subCategories,
    refetch,
  } = useQuery({
    queryKey: ["category", category["slug"], "children"],
    queryFn: ({ signal }) =>
      api
        .get(`/categories/${category["slug"]}/children`, { signal })
        .then((response) => response.data),
  });

  const refetchQueries = () => refetch();

  const [presentAddSubCategoryModal, dismissAddSubCategoryModal] = useIonModal(
    AdminCategoryFormModal,
    {
      parent: category["id"],
      onCancelled: () => dismissAddSubCategoryModal(),
      onSuccess: () => {
        dismissAddSubCategoryModal();
        refetchQueries();
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
              onEdit={refetchQueries}
              onDelete={refetchQueries}
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

const SubCategoryItem = ({ category, onEdit, onDelete }) => {
  // Delete subcategory
  const deleteMutation = useCategoryDeleteMutation(category["slug"]);

  const deleteAlert = useDeleteAlert({
    header: category["name"],
    onDelete: () => deleteMutation.mutateAsync(),
    onSuccess: onDelete,
  });

  // Edit subcategory
  const [presentEditSubCategoryModal, dismissEditSubCategoryModal] =
    useIonModal(AdminCategoryFormModal, {
      edit: true,
      category,
      onCancelled: () => dismissEditSubCategoryModal(),
      onSuccess: (category) => {
        dismissEditSubCategoryModal();
        onEdit(category);
      },
    });

  const openEditSubCategoryModal = () => presentEditSubCategoryModal();

  // Action sheet
  const [presentActionSheet, dismissActionSheet] = useIonActionSheet();

  const openActions = () =>
    presentActionSheet({
      buttons: [
        {
          text: "Edit",
          data: {
            action: "edit",
          },
          handler: () => {
            openEditSubCategoryModal();
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
          src={
            category["image"]?.["cache"]?.["extra-small"] ||
            DefaultCategoryImage
          }
          className="object-cover object-center w-full h-full"
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

export default AdminSubCategories;
