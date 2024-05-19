import Countdown from "react-countdown";
import { IonButton, IonSpinner } from "@ionic/react";

export const OTPCountdown = ({ countdown, isVerifyingOTP, resendOTP }) => (
  <>
    {isVerifyingOTP ? (
      <div className="ion-text-center">
        <IonSpinner />
      </div>
    ) : (
      <Countdown
        date={countdown}
        renderer={({ minutes, seconds, completed }) => (
          <IonButton
            disabled={!completed}
            onClick={resendOTP}
            expand="block"
            color={"secondary"}
          >
            {completed ? (
              "Resend OTP"
            ) : (
              <>
                {minutes}:{seconds}
              </>
            )}
          </IonButton>
        )}
      />
    )}
  </>
);
