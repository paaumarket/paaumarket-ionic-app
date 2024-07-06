import DemandForm from "@/components/DemandForm";
import useAuth from "@/hooks/useAuth";
import {
  IonBackButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonIcon,
  IonLabel,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { IonButton, IonItem, IonList } from "@ionic/react";
import { useHistory } from "react-router-dom";
import { walletOutline } from "ionicons/icons";

export default function CreateDemand() {
  const { user, login } = useAuth();
  const history = useHistory();

  const handleSuccess = (data) => {
    login({
      user: {
        ...user,
        wallet_balance: data["wallet_balance"],
      },
    });

    history.replace("/app/me/my-demands");
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/app/demands" />
          </IonButtons>
          <IonTitle>Create Demand</IonTitle>
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
            <p>Cost of Demand: ₦100</p>
            <p>Demands will automatically close after 5 days</p>
          </IonCardContent>
        </IonCard>
        <DemandForm onSuccess={handleSuccess} />
      </IonContent>
    </IonPage>
  );
}
