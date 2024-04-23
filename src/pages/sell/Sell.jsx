import {
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonPage,
  IonRow,
  IonTextarea,
  IonTitle,
  IonToolbar,
  useIonActionSheet,
  useIonLoading,
} from "@ionic/react";

import * as yup from "yup";

import product from "../../assets/product.png";
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
import useAuth from "@/hooks/useAuth";
import { walletOutline } from "ionicons/icons";
import { useHistory } from "react-router";
import { useQueryClient } from "@tanstack/react-query";

const MAX_IMAGE_UPLOAD = 5;
export default function Sell() {
  const queryClient = useQueryClient();
  const history = useHistory();
  const { user, login } = useAuth();
  const imageInputRef = useRef();

  const form = useHookForm({
    defaultValues: {
      category_id: null,
      title: "",
      description: "",
      price: 0,
      images: [],
    },
    schema: yup
      .object({
        title: yup.string().required().label("Title"),
        description: yup.string().required().label("Description"),
        price: yup.number().required().label("Price"),
        category_id: yup.number().required().label("Category"),
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
          handler: () => removeImage(index),
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
    mutationKey: ["adverts", "create"],
    mutationFn: (data) => api.post("/adverts", serialize(data)),
  });

  const handleFormSubmit = (data) => {
    presentLoading({
      message: "Creating...",
    })
      /** Mutate */
      .then(() =>
        advertMutation.mutateAsync(data).then((response) => response.data)
      )

      /** Set advert data */
      .then((data) => {
        queryClient.setQueryData(
          ["advert", data["advert"]["id"]],
          data["advert"]
        );

        login({
          user: {
            ...user,
            wallet_balance: data["wallet_balance"],
          },
        });

        history.push("/");
      })

      /** Dismiss Loading */
      .finally(() => dismissLoading());
    advertMutation.mutate;
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Post New Advert</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <h5>
          <IonIcon icon={walletOutline} /> Wallet Balance:{" "}
          {user["wallet_balance"]}
        </h5>

        {/* Form */}
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)}>
            <IonList>
              {/* Category */}
              <Controller
                name="category_id"
                render={({ field, fieldState }) => (
                  <CategoryMultiLevelSelect
                    value={field.value}
                    onSelect={field.onChange}
                  >
                    {fieldState.invalid ? (
                      <IonNote color={"danger"}>
                        {fieldState.error.message}
                      </IonNote>
                    ) : null}
                  </CategoryMultiLevelSelect>
                )}
              />

              {/* Title */}
              <Controller
                name="title"
                render={({ field, fieldState }) => (
                  <IonItem>
                    <IonInput
                      label="Title"
                      labelPlacement="floating"
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
                      labelPlacement="floating"
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
                      labelPlacement="floating"
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
                    <IonNote className="ion-margin-top">
                      Upload Images - Minimum of 1 and Maximum of{" "}
                      {MAX_IMAGE_UPLOAD}
                    </IonNote>

                    {fieldState.invalid ? (
                      <IonNote color={"danger"}>
                        {fieldState.error.message}
                      </IonNote>
                    ) : null}

                    {/* Hidden Input file */}
                    <input
                      type="file"
                      ref={imageInputRef}
                      accept=".jpg, .jpeg, .png, .gif"
                      multiple
                      hidden
                      onChange={(ev) => {
                        appendImage(
                          Array.from(ev.target.files).slice(
                            0,
                            MAX_IMAGE_UPLOAD - field.value.length
                          )
                        );
                      }}
                    />
                    <div className="ion-margin-top">
                      {field.value.length < MAX_IMAGE_UPLOAD ? (
                        <IonButton
                          type="button"
                          onClick={() => imageInputRef.current?.click()}
                        >
                          Choose Images
                        </IonButton>
                      ) : null}
                    </div>
                    <IonGrid>
                      <IonRow>
                        {field.value.map((image, i) => (
                          <IonCol
                            key={i}
                            size="6"
                            onClick={() => openImageActions(i)}
                          >
                            <IonItem>
                              <img
                                src={URL.createObjectURL(image)}
                                onLoad={(ev) =>
                                  URL.revokeObjectURL(ev.target.src)
                                }
                              />
                            </IonItem>
                          </IonCol>
                        ))}
                      </IonRow>
                    </IonGrid>
                  </IonItem>
                )}
              />
            </IonList>

            {/* Submit Button */}
            <IonButton type="submit" expand="block" className="ion-margin-top">
              Post Advert
            </IonButton>
          </form>
        </FormProvider>
      </IonContent>
    </IonPage>
  );
}

{
  /* <ListProduct products={products} /> */
}
