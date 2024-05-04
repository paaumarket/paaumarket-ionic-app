import * as yup from "yup";
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonList,
  IonPage,
  IonSpinner,
  IonTitle,
  IonToolbar,
  useIonToast,
} from "@ionic/react";

import useHookForm from "@/hooks/useHookForm";
import useFormMutation from "@/hooks/useFormMutation";
import useAuth from "@/hooks/useAuth";
import api from "@/lib/api";
import PasswordIonInput from "@/components/PasswordIonInput";

const EditProfilePassword = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/app/me/edit" />
          </IonButtons>
          <IonTitle>Change Password</IonTitle>
        </IonToolbar>
      </IonHeader>

      {/* Page content */}
      <IonContent fullscreen>
        <PasswordEdit />
      </IonContent>
    </IonPage>
  );
};

const schema = yup
  .object({
    current_password: yup.string().trim().required().label("Current Password"),
    new_password: yup
      .string()
      .trim()
      .min(8)
      .max(16)
      .required()
      .label("New Password"),
  })
  .required();

const PasswordEdit = () => {
  const [presentToast] = useIonToast();
  const { login } = useAuth();
  const form = useHookForm({
    schema,
    defaultValues: {
      current_password: "",
      new_password: "",
    },
  });

  const passwordMutation = useFormMutation({
    form,
    mutationKey: ["user", "password"],
    mutationFn: (data) =>
      api.put("/user/password", data).then((response) => response.data),
  });

  const handleFormSubmit = (data) => {
    passwordMutation.mutate(data, {
      onSuccess(user) {
        login({ user });
        form.reset();
        presentToast({
          message: "Password Successfully Updated!",
          color: "success",
          duration: 2000,
        });
      },
    });
  };

  return (
    <form onSubmit={form.handleSubmit(handleFormSubmit)}>
      <IonList>
        {/* Current Password */}
        <IonItem>
          <PasswordIonInput
            {...form.register("current_password")}
            label="Current Password"
            errorText={form.formState.errors["current_password"]?.message}
          />
        </IonItem>

        {/* New Password */}
        <IonItem>
          <PasswordIonInput
            {...form.register("new_password")}
            label="New Password"
            errorText={form.formState.errors["new_password"]?.message}
          />
        </IonItem>
      </IonList>

      <div className="ion-padding">
        <IonButton
          expand="block"
          type="submit"
          disabled={passwordMutation.isPending}
        >
          {passwordMutation.isPending ? <IonSpinner /> : <>Save</>}
        </IonButton>
      </div>
    </form>
  );
};
export default EditProfilePassword;
