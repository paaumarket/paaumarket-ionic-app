import clsx from "clsx";
import { IonTextarea } from "@ionic/react";
import { forwardRef } from "react";

const FormIonTextarea = forwardRef(
  ({ onChange, onBlur, errorText, ...props }, ref) => {
    return (
      <IonTextarea
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

export default FormIonTextarea;
