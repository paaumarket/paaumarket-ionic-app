import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonLabel,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import * as yup from "yup";
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
import withIonPageQueryRefetch from "@/hoc/withIonPageQueryRefetch";

export default withIonPageQueryRefetch(function AdminCommand() {
  const handleSuccess = (data) => {};

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/app/me/admin" />
          </IonButtons>
          <IonTitle>Run Command</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <CommandForm onSuccess={handleSuccess} />
      </IonContent>
    </IonPage>
  );
});

const schema = yup
  .object({
    command: yup.string().trim().required().label("Command"),
  })
  .required();

const CommandForm = ({ onSuccess }) => {
  const [presentToast] = useIonToast();
  const form = useHookForm({
    schema,
    defaultValues: {
      command: "",
    },
  });

  const commandMutation = useFormMutation({
    form,
    mutationKey: ["admin", "command"],
    mutationFn: (data) =>
      api.post("/admin/command", data).then((response) => response.data),

    onSuccess(data) {
      presentToast({
        message: "Command executed",
        color: "success",
        duration: 2000,
      });
    },
  });

  const handleFormSubmit = (data) => {
    commandMutation.mutate(data, {
      onSuccess,
    });
  };

  return (
    <>
      <form onSubmit={form.handleSubmit(handleFormSubmit)}>
        <IonList>
          {/* Command */}
          <IonItem>
            <FormIonTextarea
              {...form.register("command")}
              label="Command"
              labelPlacement="stacked"
              errorText={form.formState.errors["command"]?.message}
              rows={3}
            />
          </IonItem>
        </IonList>

        <div className="ion-padding">
          <IonButton
            expand="block"
            type="submit"
            disabled={commandMutation.isPending}
          >
            {commandMutation.isPending ? <IonSpinner /> : "Run Command"}
          </IonButton>
        </div>
      </form>

      {commandMutation.isSuccess ? (
        <IonList>
          <IonItem>
            <IonLabel>
              <h5>Exit Code</h5>
              <p>{commandMutation.data["code"]}</p>
            </IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>
              <h5>Output</h5>
              <p className="font-mono whitespace-pre-wrap">
                {commandMutation.data["output"]}
              </p>
            </IonLabel>
          </IonItem>
        </IonList>
      ) : null}
    </>
  );
};
