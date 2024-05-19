import { useIonModal } from "@ionic/react";
import { OTPVerification } from "./OTPVerification";
import { useState } from "react";
import { useCallback } from "react";

export const useOTPVerification = ({ onSuccess }) => {
  const [email, setEmail] = useState(null);
  const [present, dismiss] = useIonModal(OTPVerification, {
    email,
    onSuccess,
    onCancelled() {
      dismiss();
    },
  });

  const showOtp = useCallback(
    (email) => {
      setEmail(email);
      present();
    },
    [setEmail, present]
  );

  const closeOtp = useCallback(() => dismiss(), [dismiss]);

  return [showOtp, closeOtp];
};
