import store from "../redux/store/store.js";
import { setCount, setIsCountLoading, setIsUserLoading, setIsUsersLoading, setUser, setUsers } from "../redux/slices/admin-slice.js";
import axiosInstance from "./axios-instance.js";

export const fetchCount = async () => {
  store.dispatch(setIsCountLoading(true));
  try {
    const res = await axiosInstance.get(`/users/count`);
    store.dispatch(setIsCountLoading(false));
    if (res.status === 200 && res.data.success) {
      store.dispatch(setCount(res.data.data));
    }
  } catch (error) {
    store.dispatch(setIsCountLoading(false));
    console.error("Error fetching count:", error);
  }
};

export const fetchUserList = async ({ page = 1, limit = 10, search, status, role, isMitIDVerified } = {}) => {
  store.dispatch(setIsUsersLoading(true));

  try {
    const params = { page, limit };

    if (search) params.search = search;
    if (role) params.role = role;
    if (status) params.status = status;
    if (typeof isMitIDVerified !== "undefined") {
      params.isMitIDVerified = isMitIDVerified;
    }

    const res = await axiosInstance.get(`/users`, { params });

    if (res.status === 200 && res.data.success) store.dispatch(setUsers(res.data.data));
  } catch (error) {
    console.error("Error fetching users:", error);
  } finally {
    store.dispatch(setIsUsersLoading(false));
  }
};

export const fetchSingleUser = async (id) => {
  store.dispatch(setIsUserLoading(true));
  try {
    const res = await axiosInstance.get(`/users/${id}`);
    store.dispatch(setIsUserLoading(false));
    if (res.status === 200 && res.data.success) store.dispatch(setUser(res.data.data));
  } catch (error) {
    store.dispatch(setIsUserLoading(false));
    console.error("Error fetching user:", error);
  }
};

export const manageUserStatus = async (id, status) => {
  try {
    const response = await axiosInstance.put(`/users/${id}`, { status: status });

    if (response.status === 200 && response.data.success) {
      return { status: true, message: response.data.message || "User status updated successfully" };
    } else {
      return { status: false, message: response.data.message || "Failed to update user status" };
    }
  } catch (error) {
    console.error("Status update error:", error);
    const errorMessage = error.response?.data?.message || error.message || "Failed to update user status";
    return { status: false, message: errorMessage };
  }
};