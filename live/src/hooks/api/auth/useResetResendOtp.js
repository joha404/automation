import { useMutation } from "@tanstack/react-query";
import errorToast from "@/hooks/custom/errorToast";
import useAxiosPublic from "@/hooks/useAxiosPublic";

export const useResetResendOtp = () => {
  const axiosPublic = useAxiosPublic();

  return useMutation({
    mutationFn: async (identifier) => {
     
      if (!identifier) {
        errorToast("Email not found. Please try again.");
      }
      const res = await axiosPublic.post(`/password-reset/resend-otp/`, {
        identifier: identifier,
      });
   
      if (!res?.data?.success) {
        errorToast(res?.message || "Failed to resend OTP");
      }
      return res?.data;
    },

    onSuccess: (data) => {
      errorToast(data?.message || "OTP has been resent to your email!");
    },
    onError: (error) => {
      errorToast(
        error.response?.data?.message ||
          error.message ||
          "Error resending OTP. Please try again."
      );
    },
    retry: false,
  });
};
