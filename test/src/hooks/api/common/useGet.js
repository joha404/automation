import errorToast from "@/hooks/custom/errorToast";
import useAxiosPublic from "@/hooks/useAxiosPublic";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useGet = (endpoint, options = {}) => {
  const { secure = true, queryKey, params, ...queryOptions } = options;

  const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();

  const axios = secure ? axiosSecure : axiosPublic;

  // Auto-generate queryKey if not provided
  const finalQueryKey = queryKey
    ? Array.isArray(queryKey)
      ? queryKey
      : [queryKey]
    : [endpoint, params]; // Include params for smart caching

  return useQuery({
    queryKey: finalQueryKey,
    queryFn: async () => {
      const res = await axios.get(endpoint, { params });

      if (res?.data?.success === false) {
        errorToast(res?.data?.message || "Request failed!");
        throw new Error(res?.data?.message || "Request failed!");
      }

      return res?.data ?? res?.data;
    },
    onError: (error) => {
      const message = error.response?.data?.message || error.message;
      errorToast(message || "Request failed");
    },
    retry: false,
    ...queryOptions,
  });
};
