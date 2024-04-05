import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  IonList,
  IonInput,
  IonPage,
  IonText,
  IonHeader,
  IonButton,
  IonRouterLink,
  IonToolbar,
  IonBackButton,
  IonButtons,
  IonContent,
  IonItem,
} from "@ionic/react";

// Logo Image
import logo from "../assets/paaumarket.svg";

// Schema for form validation
const schema = yup
  .object({
    name: yup.string().trim().required(),
    email: yup.string().trim().email().required(),
    mobile_phone: yup.number().positive().required(),
    password: yup.string().trim().max(16).required(),
  })
  .required();

const SignIn: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = (data) => {
    console.log(data);
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

        <IonList className="ion-padding">
          <IonItem>
            <IonInput
              type="email"
              label="Email"
              labelPlacement="floating"
              placeholder="Enter your Email address"
            ></IonInput>
          </IonItem>

          <IonItem>
            <IonInput
              type="password"
              label="Password"
              labelPlacement="floating"
              placeholder="Enter your password"
            ></IonInput>
          </IonItem>

          <IonButton
            expand="full"
            shape="round"
            className="mt-5 font-bold capitalize"
            color="success"
            size="large"
          >
            Sign In
          </IonButton>
        </IonList>

        <IonText className="ion-text-center">
          <p>
            Create an account?{" "}
            <IonRouterLink
              href="/register"
              className="hover:underline text-jade-500 cursor-pointer"
            >
              Sign Up
            </IonRouterLink>
          </p>
        </IonText>
      </IonContent>
    </IonPage>
  );
};

export default SignIn;
