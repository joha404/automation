import axiosInstance from "./axios-instance.js";
import { setToken, setUserInfo } from "../utils/cookieHelper.js";
import { postRequest } from "./http-request.js";

// Register
export const registerRequest = async (data) => {
  // API Request
  try {
    const result = await postRequest("/auth/register", data);
    return result;
  } catch (error) {
    console.log(error);
  }
};

//login
export const loginRequest = async (data) => {
  const email = data?.email?.trim();
  if (!email || !email.includes("@"))
    return {
      status: false,
      message: "Please provide a valid email address",
      data: null,
      token: null,
    };

  const result = await axiosInstance.post("/auth/login", data);

  if (result.status) {
    setToken(result.data.token);
    setUserInfo(result.data.auth);
  }

  return result;
};

//forgot password
export const forgotPasswordRequest = async ({ email }) => {
  if (!email || !email.includes("@"))
    return {
      status: false,
      message: "Please provide a valid email address",
      data: null,
    };
  return await postRequest("/password/forget", { email });
};

export const forgotPasswordOTPVerify = async (data) => {
  try {
    const result = await postRequest("password/verify-email", data);
    return result;
  } catch (error) {
    console.log(error);
  }
};

//verify otp
export const verifyEmailRequest = async (data) => {
  try {
    const result = await postRequest("/auth/email-verify", data);
    return result;
  } catch (error) {
    console.log(error);
  }
};
// /password/verify-email
//resend otp
export const resendOTPRequest = async (data) =>
  await postRequest("/auth/resend-otp", data);

// Reset Password

export const changePassword = async (data) => {
  try {
    const result = await postRequest("/password/new", data);
    return result;
  } catch (error) {
    console.log(error);
  }
};
