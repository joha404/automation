import axiosInstance from "../axios-instance";

export const getFreeTrials = async (data) => {
  try {
    const res = await axiosInstance.post("/api/free-trial/", data);
    return res.data;
  } catch (error) {
    console.error("Error in getFreeTrials:", error);
    throw error;
  }
};
