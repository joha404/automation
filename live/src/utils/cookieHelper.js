import { toast } from "react-hot-toast";

const EXPIRY_HOURS = 24;

/* ---------------- INTERNAL ---------------- */
const getExpiryTime = () => Date.now() + EXPIRY_HOURS * 60 * 60 * 1000;

/* ---------------- SET TOKEN ---------------- */
export const setToken = (token) => {
  const expiry = getExpiryTime();

  localStorage.setItem("token", token);
  localStorage.setItem("tokenExpiry", expiry);

  document.cookie = `token=${token}; path=/; expires=${new Date(
    expiry,
  ).toUTCString()}; secure; SameSite=Strict`;
};

/* ---------------- SET USER INFO ---------------- */
export const setUserInfo = (userInfo) => {
  const expiry = getExpiryTime();

  localStorage.setItem("userInfo", JSON.stringify(userInfo));
  localStorage.setItem("userInfoExpiry", expiry);

  document.cookie = `userInfo=${encodeURIComponent(
    JSON.stringify(userInfo),
  )}; path=/; expires=${new Date(
    expiry,
  ).toUTCString()}; secure; SameSite=Strict`;
};

/* ---------------- AUTO LOGOUT CHECK (GLOBAL) ---------------- */
export const autoLogoutIfExpired = () => {
  const tokenExpiry = localStorage.getItem("tokenExpiry");
  const userExpiry = localStorage.getItem("userInfoExpiry");

  if (!tokenExpiry || !userExpiry) return;

  if (Date.now() > Number(tokenExpiry) || Date.now() > Number(userExpiry)) {
    clearAuth(true);
  }
};

/* ---------------- GET TOKEN ---------------- */
export const getTokenFromCookie = () => {
  autoLogoutIfExpired();

  const name = "token=";
  const cookies = document.cookie.split(";");

  for (let c of cookies) {
    c = c.trim();
    if (c.startsWith(name)) {
      return c.substring(name.length);
    }
  }
  return null;
};

/* ---------------- GET USER INFO ---------------- */
export const getUserInfo = () => {
  autoLogoutIfExpired();

  const name = "userInfo=";
  const cookies = document.cookie.split(";");

  for (let c of cookies) {
    c = c.trim();
    if (c.startsWith(name)) {
      try {
        return JSON.parse(decodeURIComponent(c.substring(name.length)));
      } catch {
        return null;
      }
    }
  }
  return null;
};

/* ---------------- CLEAR AUTH ---------------- */
export const clearAuth = (isAuto = false) => {
  document.cookie =
    "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure; SameSite=Strict";
  document.cookie =
    "userInfo=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure; SameSite=Strict";

  localStorage.removeItem("token");
  localStorage.removeItem("userInfo");
  localStorage.removeItem("tokenExpiry");
  localStorage.removeItem("userInfoExpiry");
  sessionStorage.clear();

  toast.error(
    isAuto
      ? "Session expired. Please sign in again."
      : "Logged out successfully",
  );

  window.location.replace("/sign-in");
};

/* 🔁 OPTIONAL: backward compatibility */
export const clearToken = clearAuth;
