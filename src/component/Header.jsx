import {
  IonHeader,
  IonIcon,
  IonLabel,
  IonTabButton,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import logo from "../assets/paaumarket.svg";
import { Link } from "react-router-dom";
import { personCircleOutline } from "ionicons/icons";

export default function Header({ children }) {
  // console.log();
  return (
    <IonHeader className="ion-no-border ion-padding-start ion-padding-end">
      <IonToolbar>
        <div className="flex justify-center items-center">
          <>{children}</>
          <Link to="/login">
            <IonIcon size="large" icon={personCircleOutline} />
          </Link>
        </div>
      </IonToolbar>
    </IonHeader>
  );
}
