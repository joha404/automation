import store from "../redux/store/store.js";
import { setIsUserDataLoading, setUserData } from "../redux/slices/user-slice.js";
import axiosInstance from "./axios-instance.js";

export const fetchUserData = async () => {
  store.dispatch(setIsUserDataLoading(true));

  try {
    const res = await axiosInstance.get("/user/profile");
    if (res.data && res.status === 200) store.dispatch(setUserData(res.data.data));
  } catch (error) {
    console.error("Failed to fetch user data:", error?.response?.data || error.message);
  } finally {
    store.dispatch(setIsUserDataLoading(false));
  }
};

//forgot password
export const updateProfileRequest = async (data) => await axiosInstance.patch("/user/profile", data);

//update avatar
export const updateAvatarRequest = async (data) => {
  try {
    const response = await axiosInstance.patch(`/user/profile`, data, { validateStatus: (status) => status >= 200 && status < 500, });
    const { status, data: resData } = response;

    if (status === 200 || status === 201) return { status: true, message: resData.message || "Profile changed successful", data: resData.data || null, };

    return { status: false, message: resData.message || "Failed to change profile", data: null };
  } catch (error) {
    console.error("Profile password error:", error);
    return {
      status: false,
      message: error?.response?.data?.message || error.message || "Unexpected error occurred",
      data: null,
    };
  }
};
