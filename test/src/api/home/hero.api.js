import axiosInstance from "../axios-instance";

export const getFirstHero = async () => {
  try {
    const res = await axiosInstance.get("/api/net-units/");
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const getUltimateGraph = async () => {
  try {
    const res = await axiosInstance.get("/api/cms/ultimate/chart/");
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
