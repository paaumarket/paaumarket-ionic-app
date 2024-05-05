import {
  IonButton,
  IonCard,
  IonItem,
  IonItemGroup,
  IonLabel,
  IonList,
  IonText,
  useIonActionSheet,
  useIonLoading,
} from "@ionic/react";

import * as yup from "yup";

import CategoryMultiLevelSelect from "@/components/CategoryMultiLevelSelect";
import useHookForm from "@/hooks/useHookForm";
import { Controller, useFieldArray } from "react-hook-form";
import CurrencyInput from "react-currency-input-field";
import { useRef } from "react";
import useFormMutation from "@/hooks/useFormMutation";
import api from "@/lib/api";
import { serialize } from "object-to-formdata";
import resizeImage from "@/utils/resizeImage";

import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import FormIonInput from "./FormIonInput";
import FormIonTextarea from "./FormIonTextarea";
import { useMemo } from "react";

const MAX_IMAGE_UPLOAD = 5;
const MAX_IMAGE_DIMENSION = 1000;

export default function AdvertForm({
  advert = null,
  isEditing = false,
  isApproving = false,
  onSuccess,
}) {
  const includeCategory = isApproving || !isEditing;

  const form = useAdvertHookForm({
    advert,
    includeCategory,
    isApproving,
    isEditing,
  });

  const { append: appendImage, remove: removeImage } = useFieldArray({
    control: form.control,
    name: "images",
  });

  const [presentLoading, dismissLoading] = useIonLoading();
  const advertMutation = useFormMutation({
    form,
    mutationKey: isApproving
      ? ["adverts", advert["id"], "approve"]
      : isEditing
      ? ["adverts", advert["id"], "edit"]
      : ["adverts", "create"],
    mutationFn: (data) => {
      return api
        .post(
          isApproving
            ? `/adverts/${advert["id"]}/approve`
            : isEditing
            ? `/adverts/${advert["id"]}`
            : "/adverts",
          serialize({
            _method: isApproving || isEditing ? "put" : "post",
            ...data,

            /** Images */
            images:
              isApproving || isEditing
                ? data["images"].filter((image) => image instanceof File)
                : data["images"],

            /** Deleted images */
            ...(isApproving || isEditing
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
      message: isApproving
        ? "Approving..."
        : isEditing
        ? "Editing..."
        : "Creating...",
    })
      /** Mutate */
      .then(() => advertMutation.mutateAsync(data, { onSuccess }))

      /** Dismiss Loading */
      .finally(() => dismissLoading());
  };

  return (
    <form onSubmit={form.handleSubmit(handleFormSubmit)}>
      <IonList inset>
        {/* Category */}
        {includeCategory ? (
          <Controller
            control={form.control}
            name="category_id"
            render={({ field, fieldState }) => (
              <CategoryMultiLevelSelect
                value={field.value}
                onSelect={(value) => field.onChange(value)}
                errorText={fieldState.error?.message}
              />
            )}
          />
        ) : null}

        <IonItemGroup>
          {/* Title */}
          <IonItem>
            <FormIonInput
              {...form.register("title")}
              label="Title"
              labelPlacement="stacked"
              errorText={form.formState.errors["title"]?.message}
            />
          </IonItem>

          {/* Description */}
          <IonItem>
            <FormIonTextarea
              {...form.register("description")}
              autoGrow
              label="Description"
              labelPlacement="stacked"
              errorText={form.formState.errors["description"]?.message}
              rows={5}
            />
          </IonItem>

          {/* Price */}
          <Controller
            control={form.control}
            name="price"
            render={({ field, fieldState }) => (
              <IonItem>
                <CurrencyInput
                  customInput={FormIonInput}
                  label="Price"
                  labelPlacement="stacked"
                  step={1}
                  placeholder={0}
                  ref={field.ref}
                  value={field.value}
                  onValueChange={(value) => field.onChange(value)}
                  errorText={fieldState.error?.message}
                />
              </IonItem>
            )}
          />

          {/* Images */}
          <Controller
            control={form.control}
            name="images"
            render={({ field, fieldState }) => (
              <ImagesInput
                images={field.value}
                appendImage={appendImage}
                removeImage={removeImage}
                errorText={fieldState.error?.message}
              />
            )}
          />
        </IonItemGroup>
      </IonList>

      {/* Submit Button */}
      <IonButton
        color={isApproving ? "success" : "primary"}
        type="submit"
        expand="block"
        className="ion-margin"
      >
        {isApproving ? "Approve" : isEditing ? "Save" : "Post Advert"}
      </IonButton>
    </form>
  );
}

/** ImagesInput */
const ImagesInput = ({ images, appendImage, removeImage, errorText }) => {
  const imageInputRef = useRef();

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

  return (
    <IonItem>
      <IonLabel position="stacked">Images</IonLabel>
      <div className="flex flex-col w-full gap-2 py-2">
        <IonText color={"medium"} className="text-xs">
          Upload Images - Minimum of 1 and Maximum of {MAX_IMAGE_UPLOAD}
        </IonText>

        {/* Error message */}
        {errorText ? (
          <IonText color={"danger"} className="text-xs">
            {errorText}
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
                .slice(0, MAX_IMAGE_UPLOAD - images.length)
                .map((file) => resizeImage(file, MAX_IMAGE_DIMENSION))
            ).then((images) => appendImage(images));
          }}
        />

        {/* Add image button */}
        <div className="ion-margin-top">
          <IonButton
            type="button"
            onClick={() => imageInputRef.current?.click()}
            disabled={images.length === MAX_IMAGE_UPLOAD}
          >
            Choose Images
          </IonButton>
        </div>

        {/* Image list */}
        <ResponsiveMasonry
          columnsCountBreakPoints={{
            425: 2,
            567: 3,
            768: 4,
            1200: 5,
          }}
        >
          <Masonry gutter="10px">
            {/* Images */}
            {images.map((image, i) => (
              <IonCard
                key={i}
                onClick={() => openImageActions(i)}
                className="w-full ion-no-margin"
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
                  className="w-full"
                />
              </IonCard>
            ))}
          </Masonry>
        </ResponsiveMasonry>
      </div>
    </IonItem>
  );
};

/** useAdvertHookForm */
const useAdvertHookForm = ({
  advert,
  includeCategory,
  isApproving,
  isEditing,
}) => {
  const schema = useMemo(
    () =>
      yup
        .object({
          /** Category ID */
          ...(includeCategory
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
    [advert, includeCategory, isApproving, isEditing]
  );

  return useHookForm({
    defaultValues: {
      /** Category ID */
      ...(includeCategory
        ? {
            category_id: isApproving ? advert["category_id"] : null,
          }
        : null),
      /** Other attributes */
      title: isApproving || isEditing ? advert["title"] : "",
      description: isApproving || isEditing ? advert["description"] : "",
      price: isApproving || isEditing ? advert["price"] : 0,
      images: isApproving || isEditing ? advert["images"] : [],
    },
    schema,
  });
};
