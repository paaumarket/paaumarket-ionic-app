import React from "react";

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

// Schema for form validation
const schema = yup
  .object({
    new_password: yup.string().trim().max(16).required().label("Email"),
  })
  .required();

export default function ForgetPassword() {
  const form = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "",
    },
  });

  const passwordMutation = useFormMutation({
    form,
    mutationKey: ["forgoetPassword"],
    mutationFn: (data) =>
      api.post("/forget_password", data).then((response) => response.data),
  });

  const onSubmit = (data) => {
    passwordMutation.mutate(data, {});
  };
  return (
    <IonPage>
      <IonContent className="ion-padding" fullscreen>
        <div className="h-10"></div>
        <IonText>
          <h2>
            <b>Forget Password?</b>
          </h2>

          <p>
            <IonText color="medium">
              Don't worry! It occurs. Please enter the email address linked with
              your account.
            </IonText>
          </p>
        </IonText>

        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <IonList>
              <Controller
                name={"email"}
                render={({ field, fieldState }) => (
                  <IonItem>
                    <IonInput
                      type="text"
                      label="Your email"
                      labelPlacement="floating"
                      placeholder="Enter your email"
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
              {passwordMutation.isPending ? <IonSpinner /> : <>Send Code</>}
            </IonButton>
          </form>
        </FormProvider>
      </IonContent>
    </IonPage>
  );
}
