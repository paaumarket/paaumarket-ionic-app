import * as yup from "yup";
import { IonButton, IonItem, IonList, IonSpinner, IonText } from "@ionic/react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

// Logo Image
import api from "@/lib/api";
import useAuth from "@/hooks/useAuth";
import useFormMutation from "@/hooks/useFormMutation";
import FormIonInput from "./FormIonInput";
import PasswordIonInput from "./PasswordIonInput";

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
    <form onSubmit={form.handleSubmit(onLogIn)}>
      <IonList className="ion-padding ion-margin-bottom">
        {/* Email */}
        <IonItem>
          <FormIonInput
            {...form.register("email")}
            label="Email"
            labelPlacement="stacked"
            errorText={form.formState.errors["email"]?.message}
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

        <Link className="block text-sm text-right" to="/forgot-password">
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
  );
};

export default SignInForm;
