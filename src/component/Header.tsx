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

export default function Header() {
  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonTitle>
            <div className="flex justify-center items-center">
              <Link to="/">
                <img src={logo} alt="Paau Market Logo" className="w-10 h-10" />
              </Link>
              <div className="grow text-center">PAAU Market</div>
              <Link to="/login">
                <IonIcon icon={personCircleOutline} />
              </Link>
            </div>
          </IonTitle>
        </IonToolbar>
      </IonHeader>
    </>
  );
}
