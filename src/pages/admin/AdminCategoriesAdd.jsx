import * as yup from "yup";
import api from "@/lib/api";
import clsx from "clsx";
import useFormMutation from "@/hooks/useFormMutation";
import useHookForm from "@/hooks/useHookForm";
import { Controller, FormProvider } from "react-hook-form";
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonLoading,
} from "@ionic/react";
import { useRef } from "react";
import { serialize } from "object-to-formdata";
import { useHistory } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

const AdminCategoriesAdd = () => {
  const history = useHistory();
  const queryClient = useQueryClient();

  const [present, dismiss] = useIonLoading();
  const imageInputRef = useRef();
  const form = useHookForm({
    defaultValues: {
      name: "",
      image: null,
    },
    schema: yup
      .object({
        name: yup.string().required().label("Category Name"),
      })
      .required(),
  });

  const mutation = useFormMutation({
    form,
    mutationKey: ["categories", "create"],
    mutationFn: (data) =>
      api
        .post("/categories", serialize(data))
        .then((response) => response.data),
  });

  const handleFormSubmit = (data) => {
    present({
      message: "Creating category...",
    })
      .then(() => mutation.mutateAsync(data))
      .then((category) => {
        queryClient.setQueryData(["category", category.slug], category);
        history.replace(`/admin/categories/${category.slug}`);
      })
      .finally(() => dismiss());
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/admin/categories" />
          </IonButtons>
          <IonTitle>Add Category</IonTitle>
        </IonToolbar>
      </IonHeader>

      {/* Content */}
      <IonContent fullscreen>
        {/* Form */}
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)}>
            <IonList>
              {/* Name */}
              <Controller
                name="name"
                render={({ field, fieldState }) => (
                  <IonItem>
                    <IonInput
                      autofocus
                      label="Name"
                      labelPlacement="stacked"
                      ref={field.ref}
                      value={field.value}
                      onIonInput={field.onChange}
                      onIonBlur={field.onBlur}
                      errorText={fieldState.error?.message}
                      className={clsx(
                        fieldState.invalid && "ion-invalid ion-touched"
                      )}
                    />
                  </IonItem>
                )}
              />

              {/* Image */}
              <Controller
                name="image"
                render={({ field, fieldState }) => (
                  <IonItem>
                    <IonLabel position="stacked">Image</IonLabel>
                    <input
                      type="file"
                      ref={imageInputRef}
                      accept=".jpg, .jpeg, .png, .gif"
                      hidden
                      onChange={(ev) => field.onChange(ev.target.files[0])}
                    />
                    <div className="ion-margin-top">
                      <IonButton onClick={() => imageInputRef.current?.click()}>
                        Choose Image
                      </IonButton>
                    </div>
                    {field.value ? (
                      <div className="ion-margin-top">
                        <img
                          src={URL.createObjectURL(field.value)}
                          onLoad={(ev) => URL.revokeObjectURL(ev.target.src)}
                          className="max-h-60"
                        />
                      </div>
                    ) : null}
                  </IonItem>
                )}
              />
            </IonList>

            {/* Submit Button */}
            <IonButton type="submit" expand="block" className="ion-margin-top">
              Add Category
            </IonButton>
          </form>
        </FormProvider>
      </IonContent>
    </IonPage>
  );
};

export default AdminCategoriesAdd;
