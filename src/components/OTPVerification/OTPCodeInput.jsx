import FormIonInput from "@/components/FormIonInput";
import { IonItem, IonList } from "@ionic/react";

/** OTP code input */
export const OTPCodeInput = (props) => {
  return (
    <IonList>
      <IonItem>
        <FormIonInput
          {...props}
          label="Code"
          labelPlacement="stacked"
          type="number"
        />
      </IonItem>
    </IonList>
  );
};
