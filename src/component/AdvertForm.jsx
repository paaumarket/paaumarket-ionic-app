import {
  IonButton,
  IonCard,
  IonCol,
  IonGrid,
  IonInput,
  IonItem,
  IonItemGroup,
  IonLabel,
  IonList,
  IonRow,
  IonText,
  IonTextarea,
  useIonActionSheet,
  useIonLoading,
} from "@ionic/react";

import * as yup from "yup";

import CategoryMultiLevelSelect from "@/component/CategoryMultiLevelSelect";
import useHookForm from "@/hooks/useHookForm";
import { Controller, FormProvider, useFieldArray } from "react-hook-form";
import clsx from "clsx";
import CurrencyInput from "react-currency-input-field";
import CurrencyIonInput from "@/component/CurrencyIonInput";
import { useRef } from "react";
import useFormMutation from "@/hooks/useFormMutation";
import api from "@/lib/api";
import { serialize } from "object-to-formdata";
import resizeImage from "@/utils/resizeImage";

const MAX_IMAGE_UPLOAD = 5;
const MAX_IMAGE_DIMENSION = 768;

export default function AdvertForm({ edit = false, advert = null, onSuccess }) {
  const imageInputRef = useRef();

  const form = useHookForm({
    defaultValues: {
      /** Category ID */
      ...(!edit
        ? {
            category_id: null,
          }
        : null),
      /** Other attributes */
      title: edit ? advert["title"] : "",
      description: edit ? advert["description"] : "",
      price: edit ? advert["price"] : 0,
      images: edit ? advert["images"] : [],
    },
    schema: yup
      .object({
        /** Category ID */
        ...(!edit
          ? {
              category_id: yup.number().required().label("Category"),
            }
          : null),
        /** Other attributes */
        title: yup.string().required().label("Title"),
        description: yup.string().required().label("Description"),
        price: yup.number().required().label("Price"),
        images: yup
          .array()
          .required()
          .min(1)
          .max(MAX_IMAGE_UPLOAD)
          .label("Images"),
      })
      .required(),
  });

  const { append: appendImage, remove: removeImage } = useFieldArray({
    control: form.control,
    name: "images",
  });

  const [presentLoading, dismissLoading] = useIonLoading();
  // Action sheet
  const [presentActionSheet, dismissActionSheet] = useIonActionSheet();
  const openImageActions = (index) =>
    presentActionSheet({
      buttons: [
        {
          text: "Remove",
          role: "destructive",
          data: {
            action: "delete",
          },
          handler: () => {
            removeImage(index);
          },
        },
        {
          text: "Cancel",
          role: "cancel",
          data: {
            action: "cancel",
          },
        },
      ],
    });

  const advertMutation = useFormMutation({
    form,
    mutationKey: edit
      ? ["adverts", advert["id"], "edit"]
      : ["adverts", "create"],
    mutationFn: (data) => {
      return api
        .post(
          edit ? `/adverts/${advert["id"]}` : "/adverts",
          serialize({
            _method: edit ? "put" : "post",
            ...data,

            /** Images */
            images: edit
              ? data["images"].filter((image) => image instanceof File)
              : data["images"],

            /** Deleted images */
            ...(edit
              ? {
                  /** Images that doesn't exist in the data array */
                  deleted_images: advert["images"]
                    .filter(
                      (image) =>
                        !data["images"].find(
                          (item) =>
                            !(item instanceof File) &&
                            item["id"] === image["id"]
                        )
                    )
                    .map((image) => image["id"]),
                }
              : null),
          })
        )
        .then((response) => response.data);
    },
  });

  const handleFormSubmit = (data) => {
    presentLoading({
      message: edit ? "Editing..." : "Creating...",
    })
      /** Mutate */
      .then(() => advertMutation.mutateAsync(data, { onSuccess }))

      /** Dismiss Loading */
      .finally(() => dismissLoading());
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)}>
        <IonList inset>
          {/* Category */}
          {!edit ? (
            <Controller
              name="category_id"
              render={({ field, fieldState }) => (
                <IonItemGroup>
                  <CategoryMultiLevelSelect
                    value={field.value}
                    onSelect={field.onChange}
                    errorText={fieldState.error?.message}
                  />
                </IonItemGroup>
              )}
            />
          ) : null}

          <IonItemGroup>
            {/* Title */}
            <Controller
              name="title"
              render={({ field, fieldState }) => (
                <IonItem>
                  <IonInput
                    label="Title"
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

            {/* Description */}
            <Controller
              name="description"
              render={({ field, fieldState }) => (
                <IonItem>
                  <IonTextarea
                    label="Description"
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

            {/* Price */}
            <Controller
              name="price"
              render={({ field, fieldState }) => (
                <IonItem>
                  <CurrencyInput
                    customInput={CurrencyIonInput}
                    label="Price"
                    labelPlacement="stacked"
                    step={1}
                    placeholder={0}
                    ref={field.ref}
                    value={field.value}
                    onValueChange={(value) => field.onChange(value)}
                    errorText={fieldState.error?.message}
                    className={clsx(
                      fieldState.invalid && "ion-invalid ion-touched"
                    )}
                  />
                </IonItem>
              )}
            />

            {/* Images */}
            <Controller
              name="images"
              render={({ field, fieldState }) => (
                <IonItem>
                  <IonLabel position="stacked">Images</IonLabel>
                  <div className="flex flex-col gap-2 py-2">
                    <IonText color={"medium"} className="text-xs">
                      Upload Images - Minimum of 1 and Maximum of{" "}
                      {MAX_IMAGE_UPLOAD}
                    </IonText>

                    {fieldState.invalid ? (
                      <IonText color={"danger"} className="text-xs">
                        {fieldState.error.message}
                      </IonText>
                    ) : null}

                    {/* Hidden Input file */}
                    <input
                      type="file"
                      ref={imageInputRef}
                      accept=".jpg, .jpeg, .png, .gif"
                      multiple
                      hidden
                      onChange={(ev) => {
                        Promise.all(
                          Array.from(ev.target.files)
                            .slice(0, MAX_IMAGE_UPLOAD - field.value.length)
                            .map((file) =>
                              resizeImage(file, MAX_IMAGE_DIMENSION)
                            )
                        ).then((images) => appendImage(images));
                      }}
                    />
                    <div className="ion-margin-top">
                      <IonButton
                        type="button"
                        onClick={() => imageInputRef.current?.click()}
                        disabled={field.value.length === MAX_IMAGE_UPLOAD}
                      >
                        Choose Images
                      </IonButton>
                    </div>
                    <IonGrid>
                      <IonRow>
                        {/* Images */}
                        {field.value.map((image, i) => (
                          <IonCol key={i} size="6">
                            <IonCard
                              onClick={() => openImageActions(i)}
                              className="ion-no-margin"
                            >
                              <img
                                src={
                                  image instanceof File
                                    ? URL.createObjectURL(image)
                                    : image["image"]["cache"]["medium"]
                                }
                                onLoad={
                                  image instanceof File
                                    ? (ev) => URL.revokeObjectURL(ev.target.src)
                                    : null
                                }
                              />
                            </IonCard>
                          </IonCol>
                        ))}
                      </IonRow>
                    </IonGrid>
                  </div>
                </IonItem>
              )}
            />
          </IonItemGroup>
        </IonList>

        {/* Submit Button */}
        <IonButton type="submit" expand="block" className="ion-margin">
          {edit ? "Save" : "Post Advert"}
        </IonButton>
      </form>
    </FormProvider>
  );
}
