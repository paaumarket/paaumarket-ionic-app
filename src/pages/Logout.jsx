import api from "@/lib/api";
import { IonContent, IonLoading, IonPage } from "@ionic/react";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";

export default function () {
  const history = useHistory();
  const mutation = useMutation({
    mutationKey: ["logout"],
    mutationFn: () => api.post("/logout"),
  });

  useEffect(
    () =>
      mutation.mutate(null, {
        onSettled() {
          history.replace("/");
        },
      }),
    [history]
  );

  return (
    <IonPage>
      <IonContent>
        <IonLoading isOpen />
      </IonContent>
    </IonPage>
  );
}
