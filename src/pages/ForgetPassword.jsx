import {
  IonButton,
  IonContent,
  IonItem,
  IonList,
  IonPage,
  IonSpinner,
  IonText,
} from "@ionic/react";

import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import useFormMutation from "@/hooks/useFormMutation";
import api from "@/lib/api";
import { useOTPVerification } from "@/components/OTPVerification/useOTPVerification";
import { useState } from "react";
import FormIonInput from "@/components/FormIonInput";

// Schema for form validation
const schema = yup
  .object({
    email: yup.string().trim().email().required().label("Email"),
  })
  .required();

export default function ForgetPassword() {
  const [email, setEmail] = useState("null");
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
        setEmail(data["email"]);
        showOTP();
      },
    });
  };

  const showOTP = useOTPVerification({
    email: "sadiqsalau888@gmail.com",
  });

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
          >
            {passwordMutation.isPending ? <IonSpinner /> : <>Send Code</>}
          </IonButton>
        </form>
      </IonContent>
    </IonPage>
  );
}
