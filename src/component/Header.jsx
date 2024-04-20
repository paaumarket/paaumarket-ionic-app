import { IonHeader, IonIcon, IonToolbar } from "@ionic/react";
import { Link } from "react-router-dom";
import { personCircleOutline } from "ionicons/icons";

export default function Header({ children }) {
  // console.log();
  return (
    <IonHeader className="ion-no-border">
      <IonToolbar>
        <div className="flex items-center justify-center">
          <>{children}</>
          <Link to="/home/profile" className="px-1">
            <IonIcon size="large" icon={personCircleOutline} />
          </Link>
        </div>
      </IonToolbar>
    </IonHeader>
  );
}
