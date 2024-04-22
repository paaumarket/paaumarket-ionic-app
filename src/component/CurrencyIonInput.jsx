import { IonInput } from "@ionic/react";
import { forwardRef } from "react";

const CurrencyIonInput = forwardRef(({ onChange, onBlur, ...props }, ref) => (
    <IonInput {...props} onIonInput={onChange} onIonBlur={onBlur} ref={ref} />
));

export default CurrencyIonInput;
