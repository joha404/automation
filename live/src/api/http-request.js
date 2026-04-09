import axiosInstance from "./axios-instance.js";

export const postRequest = async (url, data = {}, config = {}) => {
    try {
        const response = await axiosInstance.post(url, data, { validateStatus: (status) => status >= 200 && status < 500, ...config, });

        if (!response || !response.data) return { status: false, message: "No response received from server", data: null, token: null, code: response.status, };
        const { status, data: resData } = response;

        if (status === 200 || status === 201) return { status: true, message: resData.message || "Request successful", data: resData.data || null, token: resData.token || null, code: response.status };

        return { status: false, message: response?.data || "Something went wrong", data: null, token: null, code: response.status, };
    } catch (error) {
        console.error("Post request error:", error);
        return { status: false, message: error?.response?.data?.message || error.message || "Unexpected error occurred", data: null, token: null, code: error?.response?.status || 500 };
    }
};

// PUT Request
export const putRequest = async (url, data = {}, config = {}) => {
    try {
        const response = await axiosInstance.put(url, data, { validateStatus: (status) => status >= 200 && status < 500, ...config, });

        if (!response || !response.data) return { status: false, message: "No response received from server", data: null, token: null, code: response.status };
        const { status, data: resData } = response;

        if (status === 200 || status === 201) return { status: true, message: resData.message || "Request successful", data: resData.data || null, token: resData.token || null, code: response.status };

        return { status: false, message: resData.message || "Something went wrong", data: null, token: null, code: response.status };
    } catch (error) {
        console.error("Put request error:", error);
        return { status: false, message: error?.response?.data?.message || error.message || "Unexpected error occurred", data: null, token: null, code: error?.response?.status || 500 };
    }
};

// DELETE Request
export const deleteRequest = async (url, config = {}) => {
    try {
        const response = await axiosInstance.delete(url, { validateStatus: (status) => status >= 200 && status < 500, ...config, });

        if (!response || !response.data) return { status: false, message: "No response received from server", data: null, token: null, code: response.status, }
        const { status, data: resData } = response;

        if (status === 200 || status === 201) return { status: true, message: resData.message || "Request successful", data: resData.data || null, token: resData.token || null, code: response.status, };

        return { status: false, message: resData.message || "Something went wrong", data: null, token: null, code: response.status };
    } catch (error) {
        console.error("Delete request error:", error);
        return { status: false, message: error?.response?.data?.message || error.message || "Unexpected error occurred", data: null, token: null, code: error?.response?.status || 500 };
    }
};
