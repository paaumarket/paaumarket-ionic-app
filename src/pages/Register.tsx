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
  IonText,
  IonToolbar,
} from "@ionic/react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

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

const Register: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = (data: object) => {
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
              Sign up to Paau Market
            </h2>
          </IonText>
        </div>

        <IonList className="ion-padding">
          <IonItem>
            <IonInput
              type="text"
              label="Full Name"
              labelPlacement="floating"
              placeholder="Enter your name"
            ></IonInput>
          </IonItem>
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
              type="number"
              label="Phone Number"
              labelPlacement="floating"
              placeholder="Enter your Phone Number"
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

          <IonButton expand="full" shape="round" color="success">
            Get Started
          </IonButton>
        </IonList>

        <IonText className="ion-padding">
          <p className="text-center text-xs mb-5">
            By creating an account you agree with our Terms of Service, Privacy
            Policy, and our default Notification Settings. By creating an
            account you agree with our{" "}
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
