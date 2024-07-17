import api from "@/lib/api";
import useAuth from "@/hooks/useAuth";
import withIonPageQueryRefetch from "@/hoc/withIonPageQueryRefetch";
import { IonContent, IonPage, useIonLoading } from "@ionic/react";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default withIonPageQueryRefetch(function () {
  const { user, logout } = useAuth();
  const queryClient = useQueryClient();
  const history = useHistory();
  const mutation = useMutation({
    mutationKey: ["logout"],
    mutationFn: () => api.post("/logout"),
  });

  const [present, dismiss] = useIonLoading();

  useEffect(() => {
    present()
      .then(() => queryClient.cancelQueries())
      .then(() => mutation.mutateAsync())
      .finally(() => {
        dismiss().then(() => {
          logout();
          queryClient.removeQueries();
          history.replace("/app");
        });
      });
  }, []);

  return (
    <IonPage>
      <IonContent></IonContent>
    </IonPage>
  );
});
