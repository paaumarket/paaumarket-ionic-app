import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";

import AdminRoleForm from "./AdminRoleForm";

const AdminRoleFormModal = ({
  edit = false,
  role = null,
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
          <IonTitle>{edit ? "Edit Role" : "Add Role"}</IonTitle>
        </IonToolbar>
      </IonHeader>

      {/* Content */}
      <IonContent fullscreen>
        {/* Form */}
        <AdminRoleForm edit={edit} role={role} onSuccess={onSuccess} />
      </IonContent>
    </IonPage>
  );
};

export default AdminRoleFormModal;
