import api from "@/lib/api";
import { useIonToast } from "@ionic/react";
import { useMutation } from "@tanstack/react-query";

export const useResendOTPMutation = () => {
  const [presentToast] = useIonToast();
  return useMutation({
    mutationKey: ["otp", "resend"],
    mutationFn: (data) =>
      api.post("/otp/resend", data).then((response) => response.data),
    onSuccess() {
      presentToast({
        message: "OTP Successfully sent!",
        color: "success",
        duration: 2000,
      });
    },
    onError(error) {
      presentToast({
        message: error?.response?.data?.message || "Failed to resend OTP...",
        color: "danger",
        duration: 2000,
      });
    },
  });
};
