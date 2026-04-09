import { useMutation } from "@tanstack/react-query";
import useAxiosPublic from "@/hooks/useAxiosPublic";
import errorToast from "@/hooks/custom/errorToast";
import useAxiosSecure from "@/hooks/useAxiosSecure";

export const usePut = (endpoint, options = {}) => {
  const { secure = true, isFileUpload = false } = options;
  const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();

  const axios = secure ? axiosSecure : axiosPublic;
  return useMutation({
    mutationFn: async (variables) => {
      let config = {};

      // Special handling for file uploads
      if (isFileUpload) {
        config = {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        };
      }
      const res = await axios.put(endpoint, variables, config);
      // if (!res?.success) {
      //   throw new Error(res.data.message || "Failed to resend OTP");
      // }
      return res?.data;
    },

    onError: (error) => {
      const errorMessage =
        error.response?.data?.message || error.message || "failed";
      errorToast(errorMessage);
      throw new Error(errorMessage);
    },
    ...options, // Allow custom options override
  });
};
