import store from "../redux/store/store.js";
import axiosInstance from "./axios-instance.js";
import {
  setFooterInfo,
  setHero,
  setHowItWorks,
  setIsFooterInfoLoading,
  setIsHeroLoading,
  setIsHowItWorksLoading,
  setIsSocialsLoading,
  setIsTrustedCompanyLoading,
  setIsWhyChooseLoading,
  setSocials,
  setTrustedCompanies,
  setWhyChoose,
} from "../redux/slices/cms-slices.js";
import { postRequest } from "./http-request.js";

//fetch hero
export const fetchHeroData = async () => {
  store.dispatch(setIsHeroLoading(true));

  try {
    const res = await axiosInstance.get("/home-hero");
    if (res.data && res.status === 200)
      store.dispatch(setHero(res.data.data[0]));
  } catch (error) {
    console.error(
      "Failed to fetch hero data:",
      error?.response?.data || error.message
    );
  } finally {
    store.dispatch(setIsHeroLoading(false));
  }
};

// upsert hero
export const upsertHeroData = async (data) =>
  await postRequest("/home-hero", data);

//fetch trusted companies
export const fetchTrustedCompanies = async () => {
  store.dispatch(setIsTrustedCompanyLoading(true));

  try {
    const res = await axiosInstance.get("/company");
    if (res.data && res.status === 200)
      store.dispatch(setTrustedCompanies(res.data.data));
  } catch (error) {
    console.error(
      "Failed to fetch hero data:",
      error?.response?.data || error.message
    );
  } finally {
    store.dispatch(setIsTrustedCompanyLoading(false));
  }
};

// Upsert Trusted Section Title
export const upsertTrustedHeroSectionData = async (data) =>
  await postRequest("/company/section", data);

// Create trusted company
export const createTrustedCompany = async (data) =>
  await postRequest("/company", data);

// Update trusted company
export const updateTrustedCompany = async (data, id) => {
  try {
    const response = await axiosInstance.put(`/company/${id}`, data, {
      validateStatus: (status) => status >= 200 && status < 500,
    });

    const { status, data: resData } = response;
    if (status === 200 || status === 201)
      return {
        status: true,
        message: resData.message || "Trusted company changed successful",
        data: resData.data || null,
      };
    return {
      status: false,
      message: resData.message || "Failed to change Trusted company",
      data: null,
    };
  } catch (error) {
    console.error("Trusted company password error:", error);
    return {
      status: false,
      message:
        error?.response?.data?.message ||
        error.message ||
        "Unexpected error occurred",
      data: null,
    };
  }
};

// Delete trusted company
export const deleteTrustedCompany = async (id) => {
  try {
    const response = await axiosInstance.delete(`/company/${id}`, {
      validateStatus: (status) => status >= 200 && status < 500,
    });
    const { status, data: resData } = response;

    if (status === 200 || status === 204)
      return {
        status: true,
        message: resData?.message || "Company deleted successfully.",
      };

    return {
      status: false,
      message: resData?.message || "Failed to delete company.",
    };
  } catch (error) {
    console.error("Delete company error:", error);
    return {
      status: false,
      message:
        error?.response?.data?.message ||
        error.message ||
        "Unexpected error occurred.",
    };
  }
};

// fetch why choose
export const fetchWhyChoose = async () => {
  store.dispatch(setIsWhyChooseLoading(true));
  try {
    const res = await axiosInstance.get("/why-choose");
    if (res.data && res.status === 200)
      store.dispatch(setWhyChoose(res.data.data));
  } catch (error) {
    console.error(
      "Failed to fetch why choose data:",
      error?.response?.data || error.message
    );
  } finally {
    store.dispatch(setIsWhyChooseLoading(false));
  }
};

// Upsert Why Choose
export const upsertWhyChooseSection = async (data) =>
  await postRequest("/why-choose/section", data);

// Update why choose
export const updateWhyChooseStep = async (data, id) => {
  const formData = new FormData();
  formData.append("title", data.title);
  formData.append("subtitle", data.subtitle);

  if (data.file instanceof File) formData.append("file", data.file);

  try {
    const response = await axiosInstance.put(`/why-choose/${id}`, formData, {
      validateStatus: (status) => status >= 200 && status < 500,
    });
    const { status, data: resData } = response;

    if (status === 200 || status === 201)
      return {
        status: true,
        message: resData.message || ` ${data.label} update successful`,
        data: resData.data || null,
      };

    return {
      status: false,
      message: resData.message || "Failed to reset password",
      data: null,
    };
  } catch (error) {
    console.error("Reset password error:", error);
    return {
      status: false,
      message:
        error?.response?.data?.message ||
        error.message ||
        "Unexpected error occurred",
      data: null,
    };
  }
};

// Fetch footer info
export const fetchFooterInfo = async () => {
  store.dispatch(setIsFooterInfoLoading(true));
  try {
    const res = await axiosInstance.get("/footer");
    if (res.data && res.status === 200)
      store.dispatch(setFooterInfo(res.data.data.footerData));
  } catch (error) {
    console.error(
      "Failed to fetch card true value data:",
      error?.response?.data || error.message
    );
  } finally {
    store.dispatch(setIsFooterInfoLoading(false));
  }
};

// upsert card value
export const upsertFooterInfo = async (data) =>
  await postRequest("/footer", data);

// Fetch socials
export const fetchSocials = async () => {
  store.dispatch(setIsSocialsLoading(true));
  try {
    const res = await axiosInstance.get("/footer");
    if (res.data && res.status === 200)
      store.dispatch(setSocials(res.data.data.socials));
  } catch (error) {
    console.error(
      "Failed to fetch card true value data:",
      error?.response?.data || error.message
    );
  } finally {
    store.dispatch(setIsSocialsLoading(false));
  }
};

// create social
export const createSocial = async (data) =>
  await postRequest("/footer/social", data);

//update social
export const updateSocial = async (id, data) => {
  try {
    const response = await axiosInstance.put(`/footer/social/${id}`, data, {
      validateStatus: (status) => status >= 200 && status < 500,
    });
    const { status, data: resData } = response;

    if (status === 200 || status === 201)
      return {
        status: true,
        message: resData.message || ` ${data.label} update successful`,
        data: resData.data || null,
      };

    return {
      status: false,
      message: resData.message || "Failed to reset password",
      data: null,
    };
  } catch (error) {
    console.error("Reset password error:", error);
    return {
      status: false,
      message:
        error?.response?.data?.message ||
        error.message ||
        "Unexpected error occurred",
      data: null,
    };
  }
};

// remove social
export const deleteSocial = async (id) => {
  try {
    const response = await axiosInstance.delete(`/footer/social/${id}`, {
      validateStatus: (status) => status >= 200 && status < 500,
    });

    const { status, data: resData } = response;
    if (status === 200 || status === 204)
      return {
        status: true,
        message: resData.message || "Social deleted successfully",
        data: resData.data || null,
      };

    return {
      status: false,
      message: resData.message || "Failed to delete social",
      data: null,
    };
  } catch (error) {
    console.error("Delete social error:", error);
    return {
      status: false,
      message:
        error?.response?.data?.message ||
        error.message ||
        "Unexpected error occurred",
      data: null,
    };
  }
};

//fetch how it works
export const fetchHowItWorks = async () => {
  store.dispatch(setIsHowItWorksLoading(true));
  try {
    const res = await axiosInstance.get("/how-work");
    if (res.data && res.status === 200)
      store.dispatch(setHowItWorks(res.data.data));
  } catch (error) {
    console.error(
      "Failed to fetch card true value data:",
      error?.response?.data || error.message
    );
  } finally {
    store.dispatch(setIsHowItWorksLoading(false));
  }
};

// upsert section title
export const upsertSectionTitle = async (data) =>
  await postRequest("/how-work/section", data);

// update how it works step
export const updateHowItWorksStep = async (id, data) => {
  try {
    const response = await axiosInstance.put(`/how-work/${id}`, data, {
      validateStatus: (status) => status >= 200 && status < 500,
    });
    const { status, data: resData } = response;

    if (status === 200 || status === 201)
      return {
        status: true,
        message: resData.message || ` ${data.title} update successful`,
        data: resData.data || null,
      };

    return {
      status: false,
      message: resData.message || "Failed to reset password",
      data: null,
    };
  } catch (error) {
    console.error("Reset password error:", error);
    return {
      status: false,
      message:
        error?.response?.data?.message ||
        error.message ||
        "Unexpected error occurred",
      data: null,
    };
  }
};

//create how it works step
export const createHowItWorksStep = async (formData) => {
  for (let [key, value] of formData.entries()) console.log(key, value);
  return await postRequest("/how-work", formData);
};
