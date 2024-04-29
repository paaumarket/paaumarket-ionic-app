import * as yup from "yup";
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonInputPasswordToggle,
  IonItem,
  IonList,
  IonPage,
  IonSpinner,
  IonTitle,
  IonToolbar,
  useIonToast,
} from "@ionic/react";

import { Controller, FormProvider } from "react-hook-form";
import useHookForm from "@/hooks/useHookForm";
import clsx from "clsx";
import useFormMutation from "@/hooks/useFormMutation";
import useAuth from "@/hooks/useAuth";
import api from "@/lib/api";

const EditProfilePassword = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home/profile/edit" />
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
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)}>
        <IonList>
          {/* Current Password */}
          <Controller
            name={"current_password"}
            disabled={passwordMutation.isPending}
            render={({ field, fieldState }) => (
              <IonItem>
                <IonInput
                  type="password"
                  label="Current Password"
                  labelPlacement="stacked"
                  name={field.name}
                  onIonInput={field.onChange}
                  onIonBlur={field.onBlur}
                  value={field.value}
                  errorText={fieldState.error?.message}
                  className={clsx(
                    fieldState.invalid && "ion-invalid ion-touched"
                  )}
                >
                  <IonInputPasswordToggle slot="end"></IonInputPasswordToggle>
                </IonInput>
              </IonItem>
            )}
          />

          {/* New Password */}
          <Controller
            name={"new_password"}
            disabled={passwordMutation.isPending}
            render={({ field, fieldState }) => (
              <IonItem>
                <IonInput
                  type="password"
                  label="New Password"
                  labelPlacement="stacked"
                  name={field.name}
                  onIonInput={field.onChange}
                  onIonBlur={field.onBlur}
                  value={field.value}
                  errorText={fieldState.error?.message}
                  className={clsx(
                    fieldState.invalid && "ion-invalid ion-touched"
                  )}
                >
                  <IonInputPasswordToggle slot="end"></IonInputPasswordToggle>
                </IonInput>
              </IonItem>
            )}
          />
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
    </FormProvider>
  );
};
export default EditProfilePassword;
