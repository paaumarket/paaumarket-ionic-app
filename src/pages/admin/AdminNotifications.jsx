import * as yup from "yup";
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonPage,
  IonSpinner,
  IonTitle,
  IonToolbar,
  useIonToast,
} from "@ionic/react";

import useHookForm from "@/hooks/useHookForm";
import useFormMutation from "@/hooks/useFormMutation";
import api from "@/lib/api";
import FormIonInput from "@/components/FormIonInput";
import FormIonTextarea from "@/components/FormIonTextarea";
import { useRef } from "react";
import resizeImage from "@/utils/resizeImage";
import { Controller } from "react-hook-form";

import { serialize } from "object-to-formdata";
import withIonPageQueryRefetch from "@/hoc/withIonPageQueryRefetch";

const AdminNotifications = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/app/me/admin" />
          </IonButtons>
          <IonTitle>Create System Notification</IonTitle>
        </IonToolbar>
      </IonHeader>

      {/* Page content */}
      <IonContent fullscreen>
        <NotificationForm />
      </IonContent>
    </IonPage>
  );
};

const schema = yup
  .object({
    message: yup.string().trim().required().label("Message"),
    link: yup.string().trim().nullable().label("Link"),
    banner: yup.mixed().nullable().label("Banner"),
  })
  .required();

const NotificationForm = () => {
  const imageUploadRef = useRef();
  const [presentToast] = useIonToast();
  const form = useHookForm({
    schema,
    defaultValues: {
      message: "",
      link: null,
      banner: null,
    },
  });

  const notificationMutation = useFormMutation({
    form,
    mutationKey: ["admin", "notifications", "broadcast"],
    mutationFn: (data) =>
      api.post("/admin/notifications", data).then((response) => response.data),
  });

  const handleFormSubmit = (data) => {
    notificationMutation.mutate(serialize(data), {
      onSuccess() {
        presentToast({
          message: "Notification Sent!",
          color: "success",
          duration: 2000,
        });
        form.reset();
      },
    });
  };

  return (
    <form onSubmit={form.handleSubmit(handleFormSubmit)}>
      <IonList>
        {/* Message */}
        <IonItem>
          <FormIonTextarea
            {...form.register("message")}
            label="Message"
            labelPlacement="stacked"
            errorText={form.formState.errors["message"]?.message}
            rows={5}
          />
        </IonItem>

        {/* Link */}
        <IonItem>
          <FormIonInput
            {...form.register("link")}
            label="Link"
            labelPlacement="stacked"
            errorText={form.formState.errors["link"]?.message}
            placeholder="e.g /app/sell"
          />
        </IonItem>

        {/* Banner */}
        <IonItem>
          <IonLabel position="stacked">Banner</IonLabel>

          <Controller
            control={form.control}
            name="banner"
            render={({ field }) => (
              <div className="flex flex-col gap-4 py-4">
                {field.value ? (
                  <div className="flex justify-center">
                    <img
                      src={URL.createObjectURL(field.value)}
                      onLoad={(ev) => URL.revokeObjectURL(ev.target.src)}
                      className="object-cover object-center w-full h-full"
                    />
                  </div>
                ) : null}
                {/* Button to upload photo */}
                <IonButton onClick={() => imageUploadRef.current?.click()}>
                  Attach banner
                </IonButton>

                {/* Button to remove banner */}
                {field.value ? (
                  <IonButton
                    color={"danger"}
                    onClick={() => field.onChange(null)}
                  >
                    Remove banner
                  </IonButton>
                ) : null}

                {/* Hidden Input file */}
                <input
                  type="file"
                  ref={imageUploadRef}
                  accept=".jpg, .jpeg, .png, .gif, .webp"
                  hidden
                  onChange={(ev) => {
                    resizeImage(ev.target.files[0], 512)
                      .then(field.onChange)
                      .finally(() => (ev.target.value = ""));
                  }}
                />
              </div>
            )}
          />
        </IonItem>
      </IonList>

      <div className="ion-padding">
        <IonButton
          expand="block"
          type="submit"
          disabled={notificationMutation.isPending}
        >
          {notificationMutation.isPending ? <IonSpinner /> : <>Broadcast</>}
        </IonButton>
      </div>

      <div className="ion-padding">
        <IonNote color="warning">
          Note: Link must be an internal link, no (https://) and no domain name,
          just the path.. e.g /app/sell
        </IonNote>
      </div>
    </form>
  );
};
export default withIonPageQueryRefetch(AdminNotifications);
