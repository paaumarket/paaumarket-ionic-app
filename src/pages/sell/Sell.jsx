import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonList,
  IonPage,
  IonTextarea,
  IonTitle,
  IonToolbar,
} from "@ionic/react";

import * as yup from "yup";

import product from "../../assets/product.png";
import CategoryMultiLevelSelect from "@/component/CategoryMultiLevelSelect";
import useHookForm from "@/hooks/useHookForm";
import { Controller, FormProvider } from "react-hook-form";
import clsx from "clsx";
import CurrencyInput from "react-currency-input-field";
import CurrencyIonInput from "@/component/CurrencyIonInput";

// API DEMO
const products = [
  {
    _id: 1,
    description: "Apple iPhone X 64 GB White",
    price: "35000",
    createdAt: "15th Dec, 2023",
    thumbnail: product,
  },
];

export default function Sell() {
  const form = useHookForm({
    defaultValues: {
      name: "",
      description: "",
      images: [],
      category_id: null,
      price: 0,
    },
    schema: yup
      .object({
        name: yup.string().required().label("Name"),
        description: yup.string().required().label("Description"),
        price: yup.number().required().label("Price"),
        category_id: yup.number().required().label("Category"),
      })
      .required(),
  });

  const handleFormSubmit = () => {};

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Post New Advert</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {/* Form */}
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)}>
            <IonList>
              {/* Category */}
              <Controller
                name="category_id"
                render={({ field }) => (
                  <CategoryMultiLevelSelect
                    value={field.value}
                    onSelect={field.onChange}
                  />
                )}
              />

              {/* Name */}
              <Controller
                name="name"
                render={({ field, fieldState }) => (
                  <IonItem>
                    <IonInput
                      label="Name"
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
