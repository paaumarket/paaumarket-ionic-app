import { useIonToast } from "@ionic/react";
import { useMutation } from "@tanstack/react-query";

const useFormMutation = ({ form, ...props }) => {
    const [toast, dismiss] = useIonToast();
    return useMutation({
        onMutate: () => dismiss(),
        onError: (error) => {
            if (error.response) {
                const { message, errors } = error.response.data;
                // Set form error
                Object.entries(errors).forEach(([k, v]) =>
                    form.setError(k, { message: v })
                );

                // Toast
                toast({
                    message,
                    duration: 3000,
                    color: "danger",
                });
            }
        },
        ...props,
    });
};

export default useFormMutation;
