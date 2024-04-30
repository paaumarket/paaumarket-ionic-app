import * as yup from "yup";
import api from "@/lib/api";
import clsx from "clsx";
import useFormMutation from "@/hooks/useFormMutation";
import useHookForm from "@/hooks/useHookForm";
import { Controller, FormProvider } from "react-hook-form";
import {
  IonButton,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  useIonLoading,
} from "@ionic/react";
import { useRef } from "react";
import { serialize } from "object-to-formdata";
import { useQueryClient } from "@tanstack/react-query";
import resizeImage from "@/utils/resizeImage";

const AdminCategoryForm = ({
  edit = false,
  category = null,
  parent = null,
  onSuccess,
}) => {
  const queryClient = useQueryClient();

  const [presentLoading, dismissLoading] = useIonLoading();

  const imageInputRef = useRef();

  const hasParent = (edit && category["parent_id"]) || parent;
  const form = useHookForm({
    defaultValues: {
      name: edit ? category["name"] : "",
      image: null,

      /** Add cost */
      ...(hasParent ? { cost: edit ? category["cost"] : 0 } : null),
    },

    schema: yup
      .object({
        name: yup.string().required().label("Category Name"),

        /** Add cost */
        ...(hasParent ? { cost: yup.number().required().label("Cost") } : null),
      })
      .required(),
  });

  const mutation = useFormMutation({
    form,
    mutationKey: edit
      ? ["category", category["id"], "edit"]
      : parent
      ? ["category", parent, "children", "create"]
      : ["categories", "create"],
    mutationFn: (data) =>
      api
        .post(
          edit ? `/categories/${category["slug"]}` : "/categories",
          serialize({
            /** Set request method */
            _method: edit ? "put" : "post",

            ...data,

            /** Include the parent */
            ...(hasParent
              ? { parent_id: edit ? category["parent_id"] : parent }
              : null),
          })
        )
        .then((response) => response.data),
  });

  /** Handle form submit */
  const handleFormSubmit = (data) => {
    /** Show Loading */
    presentLoading({
      message: edit ? "Editing..." : "Creating...",
    })
      /** Mutate */
      .then(() => mutation.mutateAsync(data, { onSuccess }))

      /** Update category data */
      .then((category) => {
        queryClient.setQueryData(["category", category.slug], category);
      })

      /** Dismiss Loading */
      .finally(() => dismissLoading());
  };

  return (
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
          {hasParent ? (
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
                    onIonInput={(ev) => field.onChange(ev.target.value || 0)}
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
                  onChange={(ev) =>
                    resizeImage(ev.target.files[0], 200).then((image) =>
                      field.onChange(image)
                    )
                  }
                />
                <div className="ion-margin-top">
                  <IonButton onClick={() => imageInputRef.current?.click()}>
                    Choose Image
                  </IonButton>
                </div>
                {field.value || category?.["image"] ? (
                  <div className="ion-margin-top">
                    <img
                      src={
                        field.value
                          ? URL.createObjectURL(field.value)
                          : category?.["image"]?.["cache"]?.["small"]
                      }
                      onLoad={
                        field.value
                          ? (ev) => URL.revokeObjectURL(ev.target.src)
                          : null
                      }
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
          Save
        </IonButton>
      </form>
    </FormProvider>
  );
};

export default AdminCategoryForm;
