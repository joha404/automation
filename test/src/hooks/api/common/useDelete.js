import { useMutation } from "@tanstack/react-query";
import useAxiosPublic from "@/hooks/useAxiosPublic";
import errorToast from "@/hooks/custom/errorToast";
import useAxiosSecure from "@/hooks/useAxiosSecure";

export const useDelete = (endpoint, options = {}) => {
  const { secure = true } = options;
  const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();

  const axios = secure ? axiosSecure : axiosPublic;

  return useMutation({
    mutationFn: async (idOrData) => {
      // Handle both ID-based and body-based DELETE requests
      const isSimpleDelete = ["string", "number"].includes(typeof idOrData);
      const url = isSimpleDelete ? `${endpoint}/${idOrData}/` : endpoint;
      const config = !isSimpleDelete ? { data: idOrData } : undefined;

      const res = await axios.delete(url, config);
      // if (!res?.success) {
      //   throw new Error(res?.message || "Failed to resend OTP");
      // }
      return res;
    },

    onError: (error) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Delete operation failed";
      errorToast(errorMessage);
 
    },

    ...options, // Allow custom options override
  });
};
