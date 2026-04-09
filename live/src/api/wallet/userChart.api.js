import axiosInstance from "../axios-instance";

export const getWalletChart = async () => {
  try {
    const res = await axiosInstance.get("/api/chart/user-deposits/");
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
