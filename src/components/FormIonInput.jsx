import clsx from "clsx";
import { IonInput } from "@ionic/react";
import { forwardRef } from "react";

const FormIonInput = forwardRef(
  ({ onChange, onBlur, errorText, ...props }, ref) => {
    return (
      <IonInput
        {...props}
        ref={ref}
        onIonInput={onChange}
        onIonBlur={onBlur}
        errorText={errorText}
        className={clsx(errorText && "ion-invalid ion-touched")}
      />
    );
  }
);

export default FormIonInput;
