import * as yup from "yup";
import {
  IonButton,
  IonInput,
  IonInputPasswordToggle,
  IonItem,
  IonList,
  IonSpinner,
  IonText,
} from "@ionic/react";
import { Link } from "react-router-dom";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

// Logo Image
import api from "../lib/api";
import clsx from "clsx";
import useAuth from "@/hooks/useAuth";
import useFormMutation from "@/hooks/useFormMutation";

// Schema for form validation
const schema = yup
  .object({
    email: yup.string().trim().email().required().label("Email"),
    password: yup.string().trim().max(16).required().label("Password"),
  })
  .required();

const SignInForm = ({ onSuccess }) => {
  const { login } = useAuth();

  const form = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const logInMutation = useFormMutation({
    form,
    mutationKey: ["login"],
    mutationFn: (data) =>
      api.post("/login", data).then((response) => response.data),
  });

  const onLogIn = (data) => {
    logInMutation.mutate(data, {
      onSuccess(auth) {
        login(auth);

        onSuccess();
      },
    });
  };

  return (
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
                  labelPlacement="stacked"
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
                  labelPlacement="stacked"
                  placeholder="Enter your password"
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

          <Link className="block text-sm text-right" to="/forget_password">
            Forget Password?
          </Link>
        </IonList>

        <IonButton
          expand="full"
          shape="round"
          type="submit"
          disabled={logInMutation.isPending}
        >
          {logInMutation.isPending ? <IonSpinner /> : <>Sign In</>}
        </IonButton>

        <IonText className="ion-text-center">
          <p>
            Create an account? <Link to="/register">Sign Up</Link>
          </p>
        </IonText>
      </form>
    </FormProvider>
  );
};

export default SignInForm;
