import OtpInput from "react-otp-input";

import { OTP_CODE_LENGTH } from "./OTP.constants";
import FormIonInput from "@/components/FormIonInput";
import clsx from "clsx";
import { IonItem } from "@ionic/react";

/** OTP code input */
export const OTPCodeInput = (props) => {
  return (
    <OtpInput
      {...props}
      renderInput={(inputProps) => (
        <IonItem className="basis-0 grow">
          <FormIonInput {...inputProps} />
        </IonItem>
      )}
      containerStyle="gap-2"
      inputStyle={clsx("font-bold text-2xl !w-full")}
      numInputs={OTP_CODE_LENGTH}
      shouldAutoFocus
      isInputNum
    />
  );
};
