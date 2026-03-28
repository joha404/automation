import { useMutation } from "@tanstack/react-query";
import errorToast from "@/hooks/custom/errorToast";
import useAxiosPublic from "@/hooks/useAxiosPublic";

export const useResendOtp = () => {
  const axiosPublic = useAxiosPublic();

  return useMutation({
    mutationFn: async (email) => {
     
      if (!email) {
        errorToast("Email not found. Please try again.");
      }
      const res = await axiosPublic.post(`/verify-account/resend/`, {
        email: email,
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
