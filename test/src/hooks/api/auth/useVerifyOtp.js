import { useMutation } from "@tanstack/react-query";
import successToast from "@/hooks/custom/successToast";
import errorToast from "@/hooks/custom/errorToast";
import useAxiosPublic from "@/hooks/useAxiosPublic";

export const useVerifyOtp = (endpoint) => {
  const axiosPublic = useAxiosPublic();

  return useMutation({
    mutationFn: async ({ email, otp }) => {
      // Check if OTP is complete
      if (otp.some((digit) => digit === "")) {
        errorToast("Please enter the complete OTP");
      }

      if (!email) {
        errorToast("Email not found. Please try again.");
      }
      const res = await axiosPublic.post(`${endpoint}`, {
        email: email,
        otp: otp.join(""),
      });
      if (!res?.data?.success) {
        errorToast(res.message || "OTP verification failed");
      }
      return res?.data;
    },
    onSuccess: (data) => {
      successToast(data?.message || "OTP verified successfully");
    },
    onError: (error) => {
      errorToast(
        error.response?.data?.message ||
          error.message ||
          "Your OTP is invalid or expired. Please try again."
      );
    },
    retry: false,
  });
};
