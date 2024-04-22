import * as yup from "yup";
import api from "@/lib/api";
import clsx from "clsx";
import useFormMutation from "@/hooks/useFormMutation";
import useHookForm from "@/hooks/useHookForm";
import { Controller, FormProvider } from "react-hook-form";
import {
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
import { useQueryClient } from "@tanstack/react-query";

const AdminCategoriesAddModal = ({ parent, onCancelled, onSuccess }) => {
  const queryClient = useQueryClient();

  const [present, dismiss] = useIonLoading();
  const imageInputRef = useRef();
  const form = useHookForm({
    defaultValues: {
      name: "",
      image: null,
      ...(parent ? { cost: 0 } : null),
    },
    schema: yup
      .object({
        name: yup.string().required().label("Category Name"),
        ...(parent ? { cost: yup.number().required().label("Cost") } : null),
      })
      .required(),
  });

  const mutation = useFormMutation({
    form,
    mutationKey: parent
      ? ["categories", parent["id"], "children", "create"]
      : ["categories", "create"],
    mutationFn: (data) =>
      api
        .post(
          "/categories",
          serialize({
            ...data,
            ...(parent ? { parent_id: parent["id"] } : null),
          })
        )
        .then((response) => response.data),
  });

  const handleFormSubmit = (data) => {
    present({
      message: parent ? "Creating subcategory..." : "Creating category...",
    })
      .then(() => mutation.mutateAsync(data))
      .then((category) => {
        queryClient.setQueryData(["category", category.slug], category);
        onSuccess(category);
      })
      .finally(() => dismiss());
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={() => onCancelled()}>Cancel</IonButton>
          </IonButtons>
          <IonTitle>{parent ? "Add Sub Category" : "Add Category"}</IonTitle>
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
              {/* Cost */}
              {parent ? (
                <Controller
                  name="cost"
                  render={({ field, fieldState }) => (
                    <IonItem>
                      <IonInput
                        type="number"
                        autofocus
                        min={0}
                        label="Cost"
                        labelPlacement="stacked"
                        ref={field.ref}
                        value={field.value}
                        onIonInput={(ev) =>
                          field.onChange(ev.target.value || 0)
                        }
                        onIonBlur={field.onBlur}
                        errorText={fieldState.error?.message}
                        className={clsx(
                          fieldState.invalid && "ion-invalid ion-touched"
                        )}
                      />
                    </IonItem>
                  )}
                />
              ) : null}

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

export default AdminCategoriesAddModal;
