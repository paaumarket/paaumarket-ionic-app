import {
  IonButton,
  IonButtons,
  IonHeader,
  IonIcon,
  IonToolbar,
} from "@ionic/react";
import { personCircleOutline } from "ionicons/icons";

export default function Header({ children, showProfile = true }) {
  return (
    <IonHeader className="ion-no-border">
      <IonToolbar>
        {children}

        {showProfile ? (
          <IonButtons slot="end">
            <IonButton
              routerLink="/home/profile"
              fill="clear"
              color={"primary"}
            >
              <IonIcon icon={personCircleOutline} size="large" />
            </IonButton>
          </IonButtons>
        ) : null}
      </IonToolbar>
    </IonHeader>
  );
}
