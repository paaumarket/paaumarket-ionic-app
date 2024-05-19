import api from "@/lib/api";
import { useIonToast } from "@ionic/react";
import { useMutation } from "@tanstack/react-query";

export const useVerifyOTPMutation = () => {
  const [presentToast] = useIonToast();
  return useMutation({
    mutationKey: ["otp", "verify"],
    mutationFn: (data) =>
      api.post("/otp/verify", data).then((response) => response.data),
    onSuccess() {
      presentToast({
        message: "OTP Successfully verified!",
        color: "success",
        duration: 2000,
      });
    },
    onError(error) {
      presentToast({
        message: error?.response?.data?.message || "Failed to verify OTP...",
        color: "danger",
        duration: 2000,
      });
    },
  });
};
