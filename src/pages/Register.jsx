import * as yup from "yup";
import clsx from "clsx";
import { Controller, FormProvider, useForm } from "react-hook-form";
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
import { yupResolver } from "@hookform/resolvers/yup";

import api from "../lib/api";
// Logo Image
import logo from "../assets/paaumarket.svg";
import useFormMutation from "@/hooks/useFormMutation";
import useAuth from "@/hooks/useAuth";
import { useHistory } from "react-router-dom";

// Schema for form validation
const schema = yup
  .object({
    name: yup.string().trim().required().label("Full Name"),
    email: yup.string().trim().email().required().label("Email"),
    mobile_number: yup.string().required().label("Mobile Number"),
    password: yup.string().trim().max(16).required().label("Password"),
  })
  .required();

const Register = () => {
  const history = useHistory();
  const { login } = useAuth();
  const form = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      mobile_number: undefined,
      password: "",
    },
  });

  const registrationMutation = useFormMutation({
    form,
    mutationKey: ["register"],
    mutationFn: (data) =>
      api.post("/register", data).then((response) => response.data),
  });

  const onSubmit = (data) => {
    registrationMutation.mutate(data, {
      onSuccess(auth) {
        login(auth);

        history.replace("/home");
      },
    });
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
        <div className="flex flex-col items-center justify-center gap-4 p-4">
          <img
            src={logo}
            alt="Paau Market Logo"
            className="w-20 h-20 mx-auto mt-10"
          />
          <IonText className="ion-text-color">
            <h2 className="font-bold text-center ion-no-margin text-md">
              Sign up to PAAU Market
            </h2>
          </IonText>
        </div>

        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <IonList className="ion-padding ion-margin-bottom">
              <Controller
                name={"name"}
                render={({ field, fieldState }) => (
                  <IonItem>
                    <IonInput
                      type="text"
                      label="Full Name"
                      labelPlacement="floating"
                      placeholder="Enter your name"
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
                      labelPlacement="floating"
                      placeholder="Enter your Email address"
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
                      label="Phone Number"
                      labelPlacement="floating"
                      placeholder="Enter your Phone Number"
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
            </IonList>
            <IonButton
              disabled={registrationMutation.isPending}
              expand="full"
              shape="round"
              type="submit"
            >
              {registrationMutation.isPending ? (
                <IonSpinner />
              ) : (
                <>Get Started</>
              )}
            </IonButton>
          </form>
        </FormProvider>

        <IonText className="ion-padding">
          <p className="mb-5 text-xs text-center">
            By creating an account you agree with our{" "}
            <Link to="/">Terms of Service, Privacy Policy</Link>, and our
            default <Link to="/">Notification Settings</Link>.
          </p>
        </IonText>

        <IonText className="ion-text-center">
          <p>
            Already have an account? <Link to="/login">Sign In</Link>
          </p>
        </IonText>
      </IonContent>
    </IonPage>
  );
};

export default Register;
