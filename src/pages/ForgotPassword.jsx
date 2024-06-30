import * as yup from "yup";
import FormIonInput from "@/components/FormIonInput";
import PasswordIonInput from "@/components/PasswordIonInput";
import api from "@/lib/api";
import useFormMutation from "@/hooks/useFormMutation";
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
  IonText,
  IonTitle,
  IonToolbar,
  useIonToast,
} from "@ionic/react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router";
import { useMemo } from "react";
import { useOTPVerification } from "@/components/OTPVerification/useOTPVerification";
import { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";

export default function ForgotPassword() {
  const history = useHistory();
  const [email, setEmail] = useState(null);

  return (
    <IonPage>
      <IonHeader className="shadow-none">
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/login"></IonBackButton>
          </IonButtons>
          <IonTitle>Forgot Password</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding" fullscreen>
        <div className="flex flex-col gap-4">
          {email ? (
            <ResetPasswordForm
              email={email}
              onSuccess={() => history.replace("/login")}
            />
          ) : (
            <ForgotPasswordForm onSuccess={(data) => setEmail(data["email"])} />
          )}
        </div>
      </IonContent>
    </IonPage>
  );
}

const ForgotPasswordForm = ({ onSuccess }) => {
  // Schema for form validation
  const schema = useMemo(
    () =>
      yup
        .object({
          email: yup.string().trim().email().required().label("Email"),
        })
        .required(),
    []
  );

  const form = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "",
    },
  });

  const formMutation = useFormMutation({
    form,
    mutationKey: ["forgot-password"],
    mutationFn: (data) =>
      api.post("/forgot-password", data).then((response) => response.data),
  });

  const onSubmit = (data) => {
    formMutation.mutate(data, {
      onSuccess(data) {
        showOTP(data["email"]);
      },
    });
  };

  const [showOTP, closeOtp] = useOTPVerification({
    onSuccess(data) {
      closeOtp();
      onSuccess(data);
    },
  });

  return (
    <>
      <h2>
        <b>Forget Password?</b>
      </h2>

      <p>
        <IonText color="medium">
          Don't worry! It occurs. Please enter the email address linked with
          your account.
        </IonText>
      </p>

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <IonList>
          {/* Email */}
          <IonItem>
            <FormIonInput
              {...form.register("email")}
              label="Your email"
              labelPlacement="floating"
              placeholder="Enter your email"
              errorText={form.formState.errors["email"]?.message}
              disabled={formMutation.isPending}
            />
          </IonItem>
        </IonList>

        <IonButton
          disabled={formMutation.isPending}
          expand="full"
          shape="round"
          type="submit"
          className="ion-margin-top"
        >
          {formMutation.isPending ? <IonSpinner /> : <>Send Code</>}
        </IonButton>
      </form>
    </>
  );
};

const ResetPasswordForm = ({ email, onSuccess }) => {
  const [presentToast] = useIonToast();
  // Schema for form validation
  const schema = useMemo(
    () =>
      yup
        .object({
          password: yup.string().trim().max(16).required().label("Password"),
        })
        .required(),
    []
  );

  const form = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      password: "",
    },
  });

  const formMutation = useFormMutation({
    form,
    mutationKey: ["reset-password"],
    mutationFn: (data) =>
      api.post("/reset-password", data).then((response) => response.data),
    onSuccess() {
      presentToast({
        message: "Password was successfully updated!",
        color: "success",
        duration: 2000,
      });
    },
  });

  const onSubmit = (data) => {
    formMutation.mutate(
      {
        email,
        ...data,
      },
      {
        onSuccess,
      }
    );
  };

  return (
    <>
      <h2 className="m-0 font-bold">Reset Password</h2>

      <p>
        <IonText color="medium">
          Enter a new password for your account with the email address ({email}
          ).
        </IonText>
      </p>

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <IonList>
          {/* Password */}
          <IonItem>
            <PasswordIonInput
              {...form.register("password")}
              label="Password"
              errorText={form.formState.errors["password"]?.message}
              disabled={formMutation.isPendings}
            />
          </IonItem>
        </IonList>

        <IonButton
          disabled={formMutation.isPending}
          expand="full"
          shape="round"
          type="submit"
          className="ion-margin-top"
        >
          {formMutation.isPending ? <IonSpinner /> : <>Update Password</>}
        </IonButton>
      </form>
    </>
  );
};
