import { useMutation } from "@tanstack/react-query";
import useAxiosPublic from "@/hooks/useAxiosPublic";
import errorToast from "@/hooks/custom/errorToast";
import useAxiosSecure from "@/hooks/useAxiosSecure";

export const usePost = (endpoint, options = {}) => {
  const { secure = true, isFileUpload = false } = options;
  const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();

  const axios = secure ? axiosSecure : axiosPublic;

  return useMutation({
    mutationFn: async (variables) => {
      const finalEndpoint = variables?.url || endpoint;
      const payload = variables?.data || variables;

      let config = {};
      if (isFileUpload) {
        config = {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        };
      }

      const res = await axios.post(finalEndpoint, payload, config);

      if (res?.data?.success !== true) {
        const errorMsg = res?.data?.message || "Request failed!";
        errorToast(errorMsg);
        throw new Error(errorMsg);
      }

      return res?.data;
    },
    onError: (error) => {
      console.log(error);
      const errorMessage =
        error.response?.data?.message || error.message || "Failed";
      errorToast(errorMessage);
    },
    ...options,
  });
};
