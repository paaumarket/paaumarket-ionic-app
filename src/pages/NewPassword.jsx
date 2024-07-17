import {
  IonButton,
  IonContent,
  IonInput,
  IonItem,
  IonList,
  IonPage,
  IonSpinner,
  IonText,
} from "@ionic/react";

import { Controller, FormProvider, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import useFormMutation from "@/hooks/useFormMutation";
import api from "@/lib/api";
import clsx from "clsx";
import withIonPageQueryRefetch from "@/hoc/withIonPageQueryRefetch";

// Schema for form validation
const schema = yup
  .object({
    new_password: yup.string().trim().max(16).required().label("Password"),
    confirm_password: yup.string().trim().max(16).required().label("Password"),
  })
  .required();

export default withIonPageQueryRefetch(function NewPassword() {
  const form = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      new_password: "",
      confirm_password: "",
    },
  });

  const passwordMutation = useFormMutation({
    form,
    mutationKey: ["newPassword"],
    mutationFn: (data) =>
      api.post("/new_password", data).then((response) => response.data),
  });

  const onSubmit = (data) => {
    passwordMutation.mutate(data, {});
  };
  return (
    <IonPage>
      <IonContent className="ion-padding ion-margin-top" fullscreen>
        <div className="h-10"></div>

        <IonText>
          <h3>
            <b>Create New Password</b>
          </h3>

          <p>
            <IonText color="medium">
              Your password must be different from previous used password.
            </IonText>
          </p>
        </IonText>

        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <IonList>
              <Controller
                name={"new_password"}
                render={({ field, fieldState }) => (
                  <IonItem>
                    <IonInput
                      type="text"
                      label="New Password"
                      labelPlacement="floating"
                      placeholder="Enter new password"
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
                name={"confirm_password"}
                render={({ field, fieldState }) => (
                  <IonItem>
                    <IonInput
                      type="text"
                      label="Confirm Password"
                      labelPlacement="floating"
                      placeholder="Enter confirm password"
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

            <IonButton
              disabled={passwordMutation.isPending}
              expand="full"
              shape="round"
              type="submit"
            >
              {passwordMutation.isPending ? (
                <IonSpinner />
              ) : (
                <>Change Password</>
              )}
            </IonButton>
          </form>
        </FormProvider>
      </IonContent>
    </IonPage>
  );
});
