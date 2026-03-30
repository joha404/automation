import axiosInstance from "../axios-instance";

export const getAutomationCalender = async () => {
  try {
    const res = await axiosInstance.get("/api/calendar/");
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
