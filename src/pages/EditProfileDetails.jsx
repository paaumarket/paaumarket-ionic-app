import * as yup from "yup";
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
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

const EditProfileDetails = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home/profile/edit" />
          </IonButtons>
          <IonTitle>Update Details</IonTitle>
        </IonToolbar>
      </IonHeader>

      {/* Page content */}
      <IonContent fullscreen>
        <ProfileDetailsEdit />
      </IonContent>
    </IonPage>
  );
};

const schema = yup
  .object({
    name: yup.string().trim().required().label("Full Name"),
    email: yup.string().trim().email().required().label("Email"),
    mobile_number: yup.string().required().label("Mobile Number"),
  })
  .required();

const ProfileDetailsEdit = () => {
  const { user, login } = useAuth();
  const [presentToast] = useIonToast();
  const form = useHookForm({
    schema,
    defaultValues: {
      name: user["name"],
      email: user["email"],
      mobile_number: user["mobile_number"],
    },
  });

  const profileMutation = useFormMutation({
    form,
    mutationKey: ["user", "profile", "details"],
    mutationFn: (data) =>
      api.put("/user/profile", data).then((response) => response.data),
  });

  const handleFormSubmit = (data) => {
    profileMutation.mutate(data, {
      onSuccess({ user }) {
        login({ user });
        presentToast({
          message: "Profile Successfully Updated!",
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
          <Controller
            name={"name"}
            render={({ field, fieldState }) => (
              <IonItem>
                <IonInput
                  type="text"
                  label="Name"
                  labelPlacement="stacked"
                  name={field.name}
                  onIonInput={field.onChange}
                  onIonBlur={field.onBlur}
                  value={field.value}
                  errorText={fieldState.error?.message}
                  className={clsx(
                    fieldState.invalid && "ion-invalid ion-touched"
                  )}
                ></IonInput>
              </IonItem>
            )}
          />

          <Controller
            name={"email"}
            render={({ field, fieldState }) => (
              <IonItem>
                <IonInput
                  type="email"
                  label="Email"
                  labelPlacement="stacked"
                  name={field.name}
                  onIonInput={field.onChange}
                  onIonBlur={field.onBlur}
                  value={field.value}
                  errorText={fieldState.error?.message}
                  className={clsx(
                    fieldState.invalid && "ion-invalid ion-touched"
                  )}
                ></IonInput>
              </IonItem>
            )}
          />

          <Controller
            name={"mobile_number"}
            render={({ field, fieldState }) => (
              <IonItem>
                <IonInput
                  type="number"
                  label="Mobile Number"
                  labelPlacement="stacked"
                  name={field.name}
                  onIonInput={field.onChange}
                  onIonBlur={field.onBlur}
                  value={field.value}
                  errorText={fieldState.error?.message}
                  className={clsx(
                    fieldState.invalid && "ion-invalid ion-touched"
                  )}
                ></IonInput>
              </IonItem>
            )}
          />
        </IonList>

        <div className="ion-padding">
          <IonButton
            expand="block"
            type="submit"
            disabled={profileMutation.isPending}
          >
            {profileMutation.isPending ? <IonSpinner /> : <>Save</>}
          </IonButton>
        </div>
      </form>
    </FormProvider>
  );
};
export default EditProfileDetails;
