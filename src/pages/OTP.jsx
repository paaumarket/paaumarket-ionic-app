import {
  IonButton,
  IonContent,
  IonPage,
  IonSpinner,
  IonText,
} from "@ionic/react";

import { FormProvider, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import useFormMutation from "@/hooks/useFormMutation";
import api from "@/lib/api";
import withIonPageQueryRefetch from "@/hoc/withIonPageQueryRefetch";

// Schema for form validation
const schema = yup
  .object({
    new_password: yup.string().trim().max(16).required().label("New Password"),
    confirm_password: yup
      .string()
      .trim()
      .max(16)
      .required()
      .label("Confirm Password"),
  })
  .required();

export default withIonPageQueryRefetch(function OTP() {
  const form = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      new_password: "",
      confirm_password: "",
    },
  });

  const passwordMutation = useFormMutation({
    form,
    mutationKey: ["otp_verification"],
    mutationFn: (data) =>
      api.post("/otp_verification", data).then((response) => response.data),
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
            <b>OTP Verification</b>
          </h2>

          <p>
            <IonText color="medium">
              Enter the verification code we just sent on your email address.
            </IonText>
          </p>
        </IonText>

        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="my-10">OTP box here</div>

            <IonButton
              disabled={passwordMutation.isPending}
              expand="full"
              shape="round"
              type="submit"
            >
              {passwordMutation.isPending ? <IonSpinner /> : <>Verify</>}
            </IonButton>
          </form>
        </FormProvider>
      </IonContent>
    </IonPage>
  );
});
