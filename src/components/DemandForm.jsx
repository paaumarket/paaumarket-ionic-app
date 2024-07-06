import * as yup from "yup";
import FormIonInput from "@/components/FormIonInput";
import FormIonTextarea from "@/components/FormIonTextarea";
import api from "@/lib/api";
import useFormMutation from "@/hooks/useFormMutation";
import useHookForm from "@/hooks/useHookForm";
import {
  IonButton,
  IonItem,
  IonList,
  IonSpinner,
  useIonToast,
} from "@ionic/react";
import { serialize } from "object-to-formdata";

const schema = yup
  .object({
    title: yup.string().trim().required().label("Title"),
    description: yup.string().trim().nullable().label("Description"),
  })
  .required();

const DemandForm = ({ demand, onSuccess }) => {
  const [presentToast] = useIonToast();
  const form = useHookForm({
    schema,
    defaultValues: {
      title: demand?.["title"] || "",
      description: demand?.["description"] || null,
    },
  });

  const demandMutation = useFormMutation({
    form,
    mutationKey: demand
      ? ["demands", demand["id"], "update"]
      : ["demands", "store"],
    mutationFn: (data) =>
      api
        .post(demand ? `/demands/${demand["id"]}` : "/demands", data)
        .then((response) => response.data),

    onSuccess(data) {
      presentToast({
        message: demand ? "Demand Updated!" : "Demand Submitted!",
        color: "success",
        duration: 2000,
      });
    },
  });

  const handleFormSubmit = (data) => {
    demandMutation.mutate(
      serialize({
        _method: demand ? "put" : "post",
        ...data,
      }),
      {
        onSuccess,
      }
    );
  };

  return (
    <form onSubmit={form.handleSubmit(handleFormSubmit)}>
      <IonList>
        {/* Title */}
        <IonItem>
          <FormIonInput
            {...form.register("title")}
            label="Title"
            labelPlacement="stacked"
            errorText={form.formState.errors["title"]?.message}
            placeholder="What are you looking for?"
          />
        </IonItem>

        {/* Description */}
        <IonItem>
          <FormIonTextarea
            {...form.register("description")}
            label="Description (optional)"
            labelPlacement="stacked"
            errorText={form.formState.errors["description"]?.message}
            rows={5}
          />
        </IonItem>
      </IonList>

      <div className="ion-padding">
        <IonButton
          expand="block"
          type="submit"
          disabled={demandMutation.isPending}
        >
          {demandMutation.isPending ? (
            <IonSpinner />
          ) : demand ? (
            "Update Demand"
          ) : (
            "Create Demand"
          )}
        </IonButton>
      </div>
    </form>
  );
};

export default DemandForm;
