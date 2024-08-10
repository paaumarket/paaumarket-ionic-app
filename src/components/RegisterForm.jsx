import * as yup from "yup";
import FormIonInput from "@/components/FormIonInput";
import PasswordIonInput from "@/components/PasswordIonInput";
import api from "@/lib/api";

import useAuth from "@/hooks/useAuth";
import useFormMutation from "@/hooks/useFormMutation";
import { IonButton, IonItem, IonList, IonSpinner, IonText } from "@ionic/react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { useOTPVerification } from "@/components/OTPVerification/useOTPVerification";
import { yupResolver } from "@hookform/resolvers/yup";
import withIonPageQueryRefetch from "@/hoc/withIonPageQueryRefetch";

// Schema for form validation
const schema = yup
  .object({
    name: yup.string().trim().required().label("Full Name"),
    email: yup.string().trim().email().required().label("Email"),
    mobile_number: yup.string().required().label("Mobile Number"),
    password: yup.string().trim().max(16).required().label("Password"),
  })
  .required();

const RegisterForm = ({ onSuccess }) => {
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
      onSuccess(data) {
        showOTP(data["email"]);
      },
    });
  };

  const [showOTP, closeOtp] = useOTPVerification({
    onSuccess(auth) {
      closeOtp();
      login(auth);
      onSuccess();
    },
  });

  return (
    <>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <IonList className="ion-padding ion-margin-bottom">
          {/* Name */}
          <IonItem>
            <FormIonInput
              {...form.register("name")}
              label="Name"
              labelPlacement="stacked"
              errorText={form.formState.errors["name"]?.message}
            />
          </IonItem>

          {/* Email */}
          <IonItem>
            <FormIonInput
              {...form.register("email")}
              label="Email"
              labelPlacement="stacked"
              errorText={form.formState.errors["email"]?.message}
            />
          </IonItem>

          {/* Mobile Number */}
          <IonItem>
            <FormIonInput
              {...form.register("mobile_number")}
              type="number"
              label="Mobile Number"
              labelPlacement="stacked"
              errorText={form.formState.errors["mobile_number"]?.message}
            />
          </IonItem>

          {/* Password */}
          <IonItem>
            <PasswordIonInput
              {...form.register("password")}
              label="Password"
              errorText={form.formState.errors["password"]?.message}
            />
          </IonItem>
        </IonList>
        <IonButton
          disabled={registrationMutation.isPending}
          expand="full"
          shape="round"
          type="submit"
        >
          {registrationMutation.isPending ? <IonSpinner /> : <>Get Started</>}
        </IonButton>
      </form>

      <IonText className="ion-padding">
        <p className="mb-5 text-xs text-center">
          By creating an account you agree with our{" "}
          <Link to="/">Terms of Service, Privacy Policy</Link>, and our default{" "}
          <Link to="/">Notification Settings</Link>.
        </p>
      </IonText>
    </>
  );
};

export default RegisterForm;
