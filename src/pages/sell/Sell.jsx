import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";

import useAuth from "@/hooks/useAuth";
import { useHistory } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import AdvertForm from "@/component/AdvertForm";

export default function Sell() {
  const queryClient = useQueryClient();
  const history = useHistory();
  const { user, login } = useAuth();

  const handleFormSuccess = (data) => {
    queryClient.setQueryData(["advert", data["advert"]["id"]], data["advert"]);

    login({
      user: {
        ...user,
        wallet_balance: data["wallet_balance"],
      },
    });

    history.replace("/home/profile/my-adverts");
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Post New Advert</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <AdvertForm onSuccess={handleFormSuccess} />
      </IonContent>
    </IonPage>
  );
}
