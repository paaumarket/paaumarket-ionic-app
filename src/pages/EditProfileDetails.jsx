import * as yup from "yup";
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
  IonTitle,
  IonToolbar,
  useIonToast,
} from "@ionic/react";

import useHookForm from "@/hooks/useHookForm";
import useFormMutation from "@/hooks/useFormMutation";
import useAuth from "@/hooks/useAuth";
import api from "@/lib/api";
import FormIonInput from "@/components/FormIonInput";
import withIonPageQueryRefetch from "@/hoc/withIonPageQueryRefetch";

const EditProfileDetails = withIonPageQueryRefetch(() => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/app/me/edit" />
          </IonButtons>
          <IonTitle>Update Details</IonTitle>
        </IonToolbar>
      </IonHeader>

      {/* Page content */}
      <IonContent fullscreen>
        <ProfileDetailsEdit />
      </IonContent>
    </IonPage>
  );
});

const schema = yup
  .object({
    name: yup.string().trim().required().label("Full Name"),
    email: yup.string().trim().email().required().label("Email"),
    mobile_number: yup.string().required().label("Mobile Number"),
  })
  .required();

const ProfileDetailsEdit = () => {
  const { user, login } = useAuth();
  const [presentToast] = useIonToast();
  const form = useHookForm({
    schema,
    defaultValues: {
      name: user["name"],
      email: user["email"],
      mobile_number: user["mobile_number"],
    },
  });

  const profileMutation = useFormMutation({
    form,
    mutationKey: ["user", "profile", "details"],
    mutationFn: (data) =>
      api.put("/user/profile", data).then((response) => response.data),
  });

  const handleFormSubmit = (data) => {
    profileMutation.mutate(data, {
      onSuccess(user) {
        login({ user });
        presentToast({
          message: "Profile Successfully Updated!",
          color: "success",
          duration: 2000,
        });
      },
    });
  };

  return (
    <form onSubmit={form.handleSubmit(handleFormSubmit)}>
      <IonList>
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
      </IonList>

      <div className="ion-padding">
        <IonButton
          expand="block"
          type="submit"
          disabled={profileMutation.isPending}
        >
          {profileMutation.isPending ? <IonSpinner /> : <>Save</>}
        </IonButton>
      </div>
    </form>
  );
};
export default EditProfileDetails;
