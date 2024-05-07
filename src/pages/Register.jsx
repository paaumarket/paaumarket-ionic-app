import * as yup from "yup";
import { useForm } from "react-hook-form";
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
import { Link } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";

import api from "@/lib/api";
// Logo Image
import logo from "@/assets/paaumarket.svg";
import useFormMutation from "@/hooks/useFormMutation";
import useAuth from "@/hooks/useAuth";
import { useHistory } from "react-router-dom";
import FormIonInput from "@/components/FormIonInput";
import PasswordIonInput from "@/components/PasswordIonInput";

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

        history.replace("/app");
      },
    });
  };

  return (
    <IonPage>
      <IonHeader className="shadow-none">
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/app"></IonBackButton>
          </IonButtons>
          <IonTitle>Register</IonTitle>
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
            <h2 className="font-light text-center ion-no-margin text-md">
              Sign up to PAAU Market
            </h2>
          </IonText>
        </div>

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
