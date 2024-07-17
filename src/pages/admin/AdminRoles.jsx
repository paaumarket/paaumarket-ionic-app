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
  IonSpinner,
  IonTitle,
  IonToolbar,
  useIonActionSheet,
  useIonModal,
} from "@ionic/react";
import { useMutation } from "@tanstack/react-query";
import { add, ellipsisHorizontal, ellipsisVertical } from "ionicons/icons";
import AdminRoleFormModal from "./AdminRoleFormModal";
import useDeleteAlert from "@/hooks/useDeleteAlert";
import withIonPageQueryRefetch from "@/hoc/withIonPageQueryRefetch";
import { useApiQuery } from "@/hooks/useApiQuery";

const AdminRoles = () => {
  const {
    isPending,
    isSuccess,
    data: roles,
    refetch,
  } = useApiQuery({
    queryKey: ["roles", "index"],
    queryFn: ({ signal }) =>
      api.get("roles", { signal }).then((response) => response.data),
  });

  const refetchQueries = () => refetch();

  const [presentAddRoleModal, dismissAddRoleModal] = useIonModal(
    AdminRoleFormModal,
    {
      onCancelled: () => dismissAddRoleModal(),
      onSuccess: () => {
        dismissAddRoleModal();
        refetchQueries();
      },
    }
  );

  const openAddRoleModal = () => presentAddRoleModal();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/app/me/admin" />
          </IonButtons>
          <IonTitle>Roles</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <>
          {isPending ? (
            <div className="ion-padding ion-text-center">
              <IonSpinner />
            </div>
          ) : isSuccess ? (
            <IonList>
              {roles.map((role) => (
                <RoleItem
                  key={role["id"]}
                  role={role}
                  onEdit={refetchQueries}
                  onDelete={refetchQueries}
                />
              ))}
            </IonList>
          ) : null}

          <IonFab slot="fixed" vertical="bottom" horizontal="end">
            <IonFabButton aria-label="Add Role" onClick={openAddRoleModal}>
              <IonIcon icon={add}></IonIcon>
            </IonFabButton>
          </IonFab>
        </>
      </IonContent>
    </IonPage>
  );
};

const RoleItem = ({ role, onEdit, onDelete }) => {
  // Delete role
  const deleteMutation = useRoleDeleteMutation(role["id"]);

  const deleteAlert = useDeleteAlert({
    header: role["name"],
    onDelete: () => deleteMutation.mutateAsync(),
    onSuccess: onDelete,
  });

  // Edit role
  const [presentEditRoleModal, dismissEditRoleModal] = useIonModal(
    AdminRoleFormModal,
    {
      edit: true,
      role,
      onCancelled: () => dismissEditRoleModal(),
      onSuccess: (role) => {
        dismissEditRoleModal();
        onEdit(role);
      },
    }
  );

  const openEditRoleModal = () => presentEditRoleModal();

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
            openEditRoleModal();
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
      <IonLabel>
        <h4>{role["name"]}</h4>
      </IonLabel>

      <IonButton onClick={openActions}>
        <IonIcon ios={ellipsisHorizontal} md={ellipsisVertical}></IonIcon>
      </IonButton>
    </IonItem>
  );
};

const useRoleDeleteMutation = (role) =>
  useMutation({
    mutationKey: ["role", role, "delete"],
    mutationFn: () =>
      api.delete(`/roles/${role}`).then((response) => response.data),
  });

export default withIonPageQueryRefetch(AdminRoles);
