import axiosInstance from "../axios-instance";

const getAccessToken = () => {
  try {
    const persistedData = localStorage.getItem("persist:root");
    if (!persistedData) return null;

    const parsedRoot = JSON.parse(persistedData);
    const userString = parsedRoot.user;

    if (!userString) return null;

    const userData = JSON.parse(userString);
    return userData.access_token || userData.tokens?.access_token || null;
  } catch (error) {
    console.error("Failed to parse access token from localStorage", error);
    return null;
  }
};
// Get Giveways List
export const getGiveaways = async () => {
  const token = getAccessToken();

  if (!token) {
    console.warn("No access token found. User might not be logged in.");
    throw new Error("Unauthorized: No access token");
  }

  try {
    const res = await axiosInstance.get("/api/giveaways/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    if (error.response?.status === 401) {
      console.warn(
        "Token expired or invalid. Consider refreshing or logging out.",
      );
    }
    console.error("Error fetching giveaways:", error);
    throw error;
  }
};

export const enterGiveaway = async (id) => {
  const token = getAccessToken();

  if (!token) {
    console.warn("No access token found. User might not be logged in.");
    throw new Error("Unauthorized: No access token");
  }

  try {
    const res = await axiosInstance.post(`/api/giveaways/${id}/enter/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    if (error.response?.status === 401) {
      console.warn(
        "Token expired or invalid. Consider refreshing or logging out.",
      );
    }
    console.error("Error fetching giveaways:", error);
    throw error;
  }
};

// Promo Codes
export const getPromoCodes = async () => {
  const token = getAccessToken();

  if (!token) {
    console.warn("No access token found. User might not be logged in.");
    throw new Error("Unauthorized: No access token");
  }

  try {
    const res = await axiosInstance.get("/api/my-rewards/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    if (error.response?.status === 401) {
      console.warn(
        "Token expired or invalid. Consider refreshing or logging out.",
      );
    }
    console.error("Error fetching Promo codes:", error);
    throw error;
  }
};

// Slot
export const generatePromos = async (id) => {
  const token = getAccessToken();

  if (!token) {
    console.warn("No access token found. User might not be logged in.");
    throw new Error("Unauthorized: No access token");
  }

  try {
    const res = await axiosInstance.post(`/api/slot-machine/pull/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    if (error.response?.status === 401) {
      console.warn(
        "Token expired or invalid. Consider refreshing or logging out.",
      );
    }
    console.error("Error fetching giveaways:", error);
    throw error;
  }
};

// Final Giveway
export const getWeeklyGiveaways = async () => {
  const token = getAccessToken();

  if (!token) {
    console.warn("No access token found. User might not be logged in.");
    throw new Error("Unauthorized: No access token");
  }

  try {
    const res = await axiosInstance.get("/api/giveaways/latest/weekly/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    if (error.response?.status === 401) {
      console.warn(
        "Token expired or invalid. Consider refreshing or logging out.",
      );
    }
    console.error("Error fetching giveaways:", error);
    throw error;
  }
};

export const getMonthlyGiveaways = async () => {
  const token = getAccessToken();

  if (!token) {
    console.warn("No access token found. User might not be logged in.");
    throw new Error("Unauthorized: No access token");
  }

  try {
    const res = await axiosInstance.get("/api/giveaways/latest/monthly/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    if (error.response?.status === 401) {
      console.warn(
        "Token expired or invalid. Consider refreshing or logging out.",
      );
    }
    console.error("Error fetching giveaways:", error);
    throw error;
  }
};

export const getUltimateGiveaways = async () => {
  const token = getAccessToken();

  if (!token) {
    console.warn("No access token found. User might not be logged in.");
    throw new Error("Unauthorized: No access token");
  }

  try {
    const res = await axiosInstance.get("/api/giveaways/latest/ultimate/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    if (error.response?.status === 401) {
      console.warn(
        "Token expired or invalid. Consider refreshing or logging out.",
      );
    }
    console.error("Error fetching giveaways:", error);
    throw error;
  }
};

export const getReferralHistory = async (type, limit) => {
  try {
    const res = await axiosInstance.get("/api/rewards/all/", {
      params: {
        type: type,
        limit: limit,
      },
    });

    console.log("✅ Success! Response:", res.data);
    return res.data;
  } catch (error) {
    console.error("❌ Failed!");
    console.error("Attempted URL:", error.config?.url);
    console.error("Base URL:", axiosInstance.defaults.baseURL);
    console.error(
      "Full constructed URL:",
      `${axiosInstance.defaults.baseURL}${error.config?.url}`,
    );

    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
    } else {
      console.error("Network error:", error.message);
    }
    throw error;
  }
};

// Reedem code
export const claimedPromoCode = async (data) => {
  const token = getAccessToken();

  if (!token) {
    console.warn("No access token found. User might not be logged in.");
    throw new Error("Unauthorized: No access token");
  }

  try {
    const res = await axiosInstance.post(
      `/api/slot-machine/redeem-promo/`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return res.data;
  } catch (error) {
    if (error.response?.status === 401) {
      console.warn(
        "Token expired or invalid. Consider refreshing or logging out.",
      );
    }
    console.error("Error claiming promo code:", error);
    throw error;
  }
};
