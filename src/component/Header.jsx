import { IonHeader, IonIcon, IonToolbar } from "@ionic/react";
import { Link } from "react-router-dom";
import { personCircleOutline } from "ionicons/icons";

export default function Header({ children }) {
  // console.log();
  return (
    <IonHeader className="ion-no-border">
      <IonToolbar>
        {children}
        <Link slot="end" to="/home/profile" className="px-1">
          <IonIcon size="large" icon={personCircleOutline} />
        </Link>
      </IonToolbar>
    </IonHeader>
  );
}
