import * as yup from "yup";
import api from "@/lib/api";
import useFormMutation from "@/hooks/useFormMutation";
import useHookForm from "@/hooks/useHookForm";
import {
  IonButton,
  IonItem,
  IonLabel,
  IonList,
  useIonLoading,
} from "@ionic/react";
import { useRef } from "react";
import { serialize } from "object-to-formdata";
import { useQueryClient } from "@tanstack/react-query";
import resizeImage from "@/utils/resizeImage";
import FormIonInput from "@/components/FormIonInput";

const AdminCategoryForm = ({
  edit = false,
  category = null,
  parent = null,
  onSuccess,
}) => {
  const queryClient = useQueryClient();
  const [presentLoading, dismissLoading] = useIonLoading();

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
        ...(hasParent
          ? {
              cost: yup.number().required().label("Cost"),
            }
          : null),
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

        {/* Cost */}
        {hasParent ? (
          <IonItem>
            <FormIonInput
              {...form.register("cost")}
              type="number"
              label="Cost"
              labelPlacement="stacked"
              errorText={form.formState.errors["cost"]?.message}
              min={0}
            />
          </IonItem>
        ) : null}

        {/* Image */}
        <ImageInput name="image" form={form} category={category} />
      </IonList>

      {/* Submit Button */}
      <IonButton type="submit" expand="block" className="ion-margin-top">
        Save
      </IonButton>
    </form>
  );
};

const ImageInput = ({ category, name, form }) => {
  const imageInputRef = useRef();
  const image = form.watch(name);

  return (
    <IonItem>
      <IonLabel position="stacked">Image</IonLabel>
      <input
        type="file"
        ref={imageInputRef}
        accept=".jpg, .jpeg, .png, .gif"
        hidden
        onChange={(ev) =>
          resizeImage(ev.target.files[0], 200).then((image) =>
            form.setValue(name, image)
          )
        }
      />
      <div className="ion-margin-top">
        <IonButton onClick={() => imageInputRef.current?.click()}>
          Choose Image
        </IonButton>
      </div>
      {image || category?.["image"] ? (
        <div className="ion-margin-top">
          <img
            src={
              image
                ? URL.createObjectURL(image)
                : category?.["image"]?.["cache"]?.["small"]
            }
            onLoad={image ? (ev) => URL.revokeObjectURL(ev.target.src) : null}
            className="max-h-60"
          />
        </div>
      ) : null}
    </IonItem>
  );
};

export default AdminCategoryForm;
