import { useMutation } from "@tanstack/react-query";
import useAxiosPublic from "@/hooks/useAxiosPublic";
import errorToast from "@/hooks/custom/errorToast";
import useAxiosSecure from "@/hooks/useAxiosSecure";

export const postRequest = (endpoint, options = {}) => {
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
      const res = await axios.post(endpoint, variables, config);
      if (res?.data?.success !== true) {
        errorToast(res?.data?.message || "Request failed!");
        return;
      }
      return res?.data;
    },

    onError: (error) => {
      console.log(error);
      const errorMessage =
        error.response?.data?.message || error.message || "Failed";
      errorToast(errorMessage);
    },
    ...options, // Allow custom options override
  });
};
