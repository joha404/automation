import axiosInstance from "../axios-instance";

export const getBanner = async () => {
  try {
    const res = await axiosInstance.get("/api/banner/");
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
