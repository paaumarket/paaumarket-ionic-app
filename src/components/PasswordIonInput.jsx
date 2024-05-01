import { IonInputPasswordToggle } from "@ionic/react";
import { forwardRef } from "react";
import FormIonInput from "./FormIonInput";

const PasswordIonInput = forwardRef((props, ref) => {
  return (
    <FormIonInput {...props} ref={ref} labelPlacement="stacked" type="password">
      <IonInputPasswordToggle slot="end" />
    </FormIonInput>
  );
});

export default PasswordIonInput;
