import { useIonModal } from "@ionic/react";
import { OTPVerification } from "./OTPVerification";

export const useOTPVerification = ({ email, onSuccess }) => {
  const [present, dismiss] = useIonModal(OTPVerification, {
    email,
    onSuccess,
    onCancelled() {
      dismiss();
    },
  });

  return present;
};
