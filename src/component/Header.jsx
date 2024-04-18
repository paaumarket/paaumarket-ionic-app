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
    <IonHeader className="ion-no-border">
      <IonToolbar>
        <div className="flex justify-center items-center">
          <>{children}</>
          <Link to="/login" className="px-1">
            <IonIcon size="large" icon={personCircleOutline} />
          </Link>
        </div>
      </IonToolbar>
    </IonHeader>
  );
}
