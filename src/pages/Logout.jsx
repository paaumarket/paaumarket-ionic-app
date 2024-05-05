import useAuth from "@/hooks/useAuth";
import api from "@/lib/api";
import { IonContent, IonLoading, IonPage } from "@ionic/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";

export default function () {
  const { user, logout } = useAuth();
  const queryClient = useQueryClient();
  const history = useHistory();
  const mutation = useMutation({
    mutationKey: ["logout"],
    mutationFn: () => api.post("/logout"),
  });

  useEffect(
    () => {
      queryClient.cancelQueries().then(
        ()=> 
          mutation.mutateAsync().finally(()=>{
              queryClient.removeQueries();
              logout();
              history.replace("/");
          })
      );
    },
    []
  );

  return (
    <IonPage>
      <IonContent>
        <IonLoading isOpen={Boolean(user)} message="Signing out..." />
      </IonContent>
    </IonPage>
  );
}
