import { useState } from "react";

import { OTPCodeInput } from "./OTPCodeInput";
import { OTPCountdown } from "./OTPCountdown";
import { OTP_CODE_LENGTH, OTP_COUNTDOWN_LENGTH } from "./OTP.constants";
import { useResendOTPMutation } from "./useResendOTPMutation";
import { useVerifyOTPMutation } from "./useVerifyOTPMutation";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonSpinner,
  IonText,
  IonToolbar,
} from "@ionic/react";

const getCountdown = () => Date.now() + OTP_COUNTDOWN_LENGTH;

/** OTP verification */
export const OTPVerification = ({ t, email, onSuccess, onCancelled }) => {
  const [countdown, setCountdown] = useState(getCountdown);
  const [code, setCode] = useState("");

  /** Verify OTP mutation */
  const { mutate: verifyOTP, isPending: isVerifyingOTP } =
    useVerifyOTPMutation();

  /** Resend OTP mutation */
  const { mutate: resendOTP, isPending: isResendingOTP } =
    useResendOTPMutation();

  /** Callback to check code input */
  const handleCodeInput = (ev) => {
    const code = ev.target.value;
    setCode(code);
    if (code.length === OTP_CODE_LENGTH) {
      verifyOTP({ email, code }, { onSuccess });
    }
  };

  /** Callback to resend OTP */
  const handleResendOTP = () =>
    resendOTP({ email }, { onSuccess: () => setCountdown(getCountdown()) });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={() => onCancelled()}>Cancel</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      {/* Content */}
      <IonContent fullscreen className="ion-padding">
        <div className="flex flex-col gap-2">
          {isResendingOTP ? (
            <div className="ion-text-center">
              <IonSpinner />
            </div>
          ) : (
            <>
              {/* OTP Alert */}
              <div className="flex flex-col gap-2">
                {/* Heading */}
                <h1 className="m-0 text-3xl font-light text-center">
                  OTP Verification
                </h1>

                {/* Paragraph */}
                <p className="px-4 text-center">
                  <IonText color={"medium"}>
                    Please type the OTP code sent to your email address! {email}
                  </IonText>
                </p>
              </div>

              {/* OTP Code Input */}
              <OTPCodeInput
                onChange={handleCodeInput}
                value={code}
                disabled={isVerifyingOTP}
              />

              {/* OTP Countdown */}
              <OTPCountdown
                countdown={countdown}
                isVerifyingOTP={isVerifyingOTP}
                resendOTP={handleResendOTP}
              />
            </>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};
