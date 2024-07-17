import * as yup from "yup";
import FormIonInput from "@/components/FormIonInput";
import api from "@/lib/api";
import useFormMutation from "@/hooks/useFormMutation";
import useHookForm from "@/hooks/useHookForm";
import {
  IonButton,
  IonItem,
  IonItemGroup,
  IonLabel,
  IonList,
  IonListHeader,
  IonToggle,
  useIonLoading,
} from "@ionic/react";
import { serialize } from "object-to-formdata";
import { Controller } from "react-hook-form";
import { useApiQuery } from "@/hooks/useApiQuery";

const AdminRoleForm = ({ edit = false, role = null, onSuccess }) => {
  const [presentLoading, dismissLoading] = useIonLoading();

  const form = useHookForm({
    defaultValues: {
      name: edit ? role["name"] : "",
      permissions: edit ? role["permissions"] : [],
    },

    schema: yup
      .object({
        name: yup.string().required().label("Role Name"),
      })
      .required(),
  });

  const mutation = useFormMutation({
    form,
    mutationKey: edit ? ["role", role["id"], "edit"] : ["roles", "create"],
    mutationFn: (data) =>
      api
        .post(
          edit ? `/roles/${role["id"]}` : "/roles",
          serialize({
            /** Set request method */
            _method: edit ? "put" : "post",
            ...data,
          })
        )
        .then((response) => response.data),
  });

  /** Handle form submit */
  const handleFormSubmit = (data) => {
    /** Show Loading */
    presentLoading({
      message: edit ? "Editing..." : "Creating...",
    })
      /** Mutate */
      .then(() => mutation.mutateAsync(data, { onSuccess }))

      /** Dismiss Loading */
      .finally(() => dismissLoading());
  };

  return (
    <form onSubmit={form.handleSubmit(handleFormSubmit)}>
      <IonList>
        {/* Name */}
        <IonItem>
          <FormIonInput
            {...form.register("name")}
            label="Name"
            labelPlacement="stacked"
            errorText={form.formState.errors["name"]?.message}
          />
        </IonItem>
      </IonList>

      <IonList>
        <IonListHeader>
          <IonLabel>Permissions</IonLabel>
        </IonListHeader>

        <Controller
          control={form.control}
          name="permissions"
          render={({ field }) => (
            <PermissionList active={field.value} onChange={field.onChange} />
          )}
        />
      </IonList>

      {/* Submit Button */}
      <IonButton type="submit" expand="block" className="ion-margin-top">
        Save
      </IonButton>
    </form>
  );
};

const PermissionList = ({ active, onChange }) => {
  const {
    isPending,
    isSuccess,
    data: permissions,
    refetch,
  } = useApiQuery({
    queryKey: ["permissions", "index"],
    queryFn: ({ signal }) =>
      api.get("permissions", { signal }).then((response) => response.data),
  });

  const toggle = (permission, checked) => {
    onChange(
      active
        .filter((item) => permission !== item)
        .concat(checked ? [permission] : [])
    );
  };

  return isPending ? (
    "Loading..."
  ) : isSuccess ? (
    <IonItemGroup>
      {permissions.map((permission) => (
        <IonItem key={permission["id"]}>
          <IonToggle
            checked={active.includes(permission["name"])}
            onIonChange={(ev) => toggle(permission["name"], ev.detail.checked)}
            justify="space-between"
          >
            {permission["friendly_name"]}
          </IonToggle>
        </IonItem>
      ))}
    </IonItemGroup>
  ) : (
    "Error..."
  );
};

export default AdminRoleForm;
