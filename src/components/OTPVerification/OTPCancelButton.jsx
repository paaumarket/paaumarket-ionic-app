import { IonButton, IonIcon } from "@ionic/react";
import { arrowUpLeftBox } from "ionicons/icons";

export const OTPCancelButton = ({ onCancelled }) => (
  <IonButton onClick={onCancelled} expand="block" color={"dark"}>
    <IonIcon icon={arrowUpLeftBox} />
    Cancel
  </IonButton>
);
