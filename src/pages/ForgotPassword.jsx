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
} from "@ionic/react";

import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import useFormMutation from "@/hooks/useFormMutation";
import api from "@/lib/api";
import { useOTPVerification } from "@/components/OTPVerification/useOTPVerification";
import FormIonInput from "@/components/FormIonInput";

// Schema for form validation
const schema = yup
  .object({
    email: yup.string().trim().email().required().label("Email"),
  })
  .required();

export default function ForgotPassword() {
  const form = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "",
    },
  });

  const passwordMutation = useFormMutation({
    form,
    mutationKey: ["forgot-password"],
    mutationFn: (data) =>
      api.post("/forgot-password", data).then((response) => response.data),
  });

  const onSubmit = (data) => {
    passwordMutation.mutate(data, {
      onSuccess(data) {
        showOTP(data["email"]);
      },
    });
  };

  const [showOTP, closeOtp] = useOTPVerification({
    onSuccess() {
      closeOtp();
      //
    },
  });

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
                />
              </IonItem>
            </IonList>

            <IonButton
              disabled={passwordMutation.isPending}
              expand="full"
              shape="round"
              type="submit"
              className="ion-margin-top"
            >
              {passwordMutation.isPending ? <IonSpinner /> : <>Send Code</>}
            </IonButton>
          </form>
        </div>
      </IonContent>
    </IonPage>
  );
}
