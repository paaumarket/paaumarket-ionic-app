import useAuth from "@/hooks/useAuth";
import api from "@/lib/api";
import { IonContent, IonLoading, IonPage } from "@ionic/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";

export default function () {
  const { logout } = useAuth();
  const queryClient = useQueryClient();
  const history = useHistory();
  const mutation = useMutation({
    mutationKey: ["logout"],
    mutationFn: () => api.post("/logout"),
  });

  useEffect(
    () =>
      mutation.mutate(null, {
        onSettled() {
          logout();
          history.replace("/");
          queryClient.resetQueries();
        },
      }),
    []
  );

  return (
    <IonPage>
      <IonContent>
        <IonLoading isOpen />
      </IonContent>
    </IonPage>
  );
}
