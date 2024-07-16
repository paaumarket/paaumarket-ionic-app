import AdvertForm from "@/components/AdvertForm";
import useAuth from "@/hooks/useAuth";
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useHistory } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { walletOutline } from "ionicons/icons";

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

    history.replace("/app/me/my-adverts");
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Post New Advert</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonList>
          <IonItem>
            <IonIcon
              icon={walletOutline}
              size="large"
              slot="start"
              color={"primary"}
            />

            <IonLabel>
              <h3>
                <IonText
                  color={
                    user["wallet_balance"] <= 100
                      ? "danger"
                      : user["wallet_balance"] < 1000
                      ? "warning"
                      : "success"
                  }
                >
                  ₦{Intl.NumberFormat().format(user["wallet_balance"])}
                </IonText>
              </h3>
              <p>
                <IonText color="medium">MY BALANCE</IonText>
              </p>
            </IonLabel>

            <IonButton slot="end" size="small" routerLink="/app/me/top-up">
              Add Fund
            </IonButton>
          </IonItem>
        </IonList>
        <IonCard color={"tertiary"}>
          <IonCardContent>
            Please ensure to post in the right category
          </IonCardContent>
        </IonCard>
        <AdvertForm onSuccess={handleFormSuccess} />
      </IonContent>
    </IonPage>
  );
}
