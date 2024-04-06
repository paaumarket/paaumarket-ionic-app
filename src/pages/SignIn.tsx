import * as yup from "yup";
import React from "react";
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
  IonText,
  IonToolbar,
} from "@ionic/react";
import { Link } from "react-router-dom";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

// Logo Image
import logo from "../assets/paaumarket.svg";
import { useMutation } from "@tanstack/react-query";
import api from "../lib/api";
import clsx from "clsx";

// Schema for form validation
const schema = yup
  .object({
    email: yup.string().trim().email().required().label("Email"),
    password: yup.string().trim().max(16).required().label("Password"),
  })
  .required();

const SignIn: React.FC = () => {
  const form = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const logInMutation = useMutation({
    mutationKey: ["login"],
    mutationFn: (data) =>
      api.post("/login", data).then((response) => response.data),
  });

  const onLogIn = (data: any) => {
    logInMutation.mutate(data);
  };

  return (
    <IonPage>
      <IonHeader className="shadow-none">
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/"></IonBackButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <div>
          <img
            src={logo}
            alt="Paau Market Logo"
            className="w-20 h-20 mx-auto mt-10"
          />
          <IonText className="ion-text-color">
            <h2 className="text-center text-md font-bold">
              Welcome back to Paau Market
            </h2>
          </IonText>
        </div>

        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onLogIn)}>
            <IonList className="ion-padding ion-margin-bottom">
              <Controller
                name={"email"}
                render={({ field, fieldState }) => (
                  <IonItem>
                    <IonInput
                      type="email"
                      label="Email"
                      labelPlacement="floating"
                      placeholder="Enter your email address"
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
                name={"password"}
                render={({ field, fieldState }) => (
                  <IonItem>
                    <IonInput
                      type="password"
                      label="Password"
                      labelPlacement="floating"
                      placeholder="Enter your password"
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

              <Link className="text-right block text-sm" to="/forget_password">
                Forget Passowrd?
              </Link>
            </IonList>

            <IonButton expand="full" shape="round" type="submit">
              {logInMutation.isPending ? <IonSpinner /> : <>Sign In</>}
            </IonButton>
          </form>
        </FormProvider>

        <IonText className="ion-text-center">
          <p>
            Create an account? <Link to="/register">Sign Up</Link>
          </p>
        </IonText>
      </IonContent>
    </IonPage>
  );
};

export default SignIn;
