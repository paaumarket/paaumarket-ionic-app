import clsx from "clsx";
import { IonTextarea } from "@ionic/react";
import { forwardRef } from "react";

const FormIonTextarea = forwardRef(
  ({ onChange, onBlur, errorText, className = "", ...props }, ref) => {
    return (
      <IonTextarea
        {...props}
        ref={ref}
        onIonInput={onChange}
        onIonBlur={onBlur}
        errorText={errorText}
        className={clsx(className, errorText && "ion-invalid ion-touched")}
      />
    );
  }
);

export default FormIonTextarea;
