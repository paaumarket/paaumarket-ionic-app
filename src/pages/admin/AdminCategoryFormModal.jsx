import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import AdminCategoryForm from "./AdminCategoryForm";

const AdminCategoryFormModal = ({
  edit = false,
  parent = null,
  category = null,
  onCancelled,
  onSuccess,
}) => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={() => onCancelled()}>Cancel</IonButton>
          </IonButtons>
          <IonTitle>
            {edit
              ? category["parent_id"]
                ? "Edit subcategory"
                : "Edit Category"
              : parent
              ? "Add Sub Category"
              : "Add Category"}
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      {/* Content */}
      <IonContent fullscreen>
        {/* Form */}
        <AdminCategoryForm
          edit={edit}
          category={category}
          parent={parent}
          onSuccess={onSuccess}
        />
      </IonContent>
    </IonPage>
  );
};

export default AdminCategoryFormModal;
