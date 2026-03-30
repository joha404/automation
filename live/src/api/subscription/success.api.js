import axiosInstance from "../axios-instance";

export const getMySubscription = async () => {
  try {
    const res = await axiosInstance.get("/api/my-subscription/latest/");
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
