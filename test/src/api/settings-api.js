import axiosInstance from "./axios-instance.js";
import store from "../redux/store/store.js";
import { setCloudinary, setContacts, setEmailSettings, setIsCloudinaryLoading, setIsContactsLoading, setIsEmailLoading } from "../redux/slices/settings-slice.js";

// ✅ Change password
export const changePasswordRequest = async (data) => {
    try {
        const response = await axiosInstance.put(`/profile/change-password`, data, { validateStatus: (status) => status >= 200 && status < 500, });
        const { status, data: resData } = response;

        if (status === 200 || status === 201) return { status: true, message: resData.message || "Password changed successful", data: resData.data || null, };

        return { status: false, message: resData.message || "Failed to change password", data: null };
    } catch (error) {
        console.error("Change password error:", error);
        return { status: false, message: error?.response?.data?.message || error.message || "Unexpected error occurred", data: null };
    }
};

// ✅ create contacts
export const createContacts = async (data) => {
    try {
        const response = await axiosInstance.post(`/contact-info`, data, { validateStatus: status => status >= 200 && status < 500 });
        if (!response) return { status: false, message: 'No response received from server' };

        if (response.status === 200) {
            return { status: true, message: response.data.message || 'Contact created successfully' };
        } else {
            return { status: false, message: response.data.message || 'Contact created create request failed' };
        }

    } catch (error) {
        console.error('Contact error:', error);
        const errorMessage = error.response?.data?.message || error.message || 'Failed to Create Contact request';
        return { status: false, message: errorMessage };
    }
};


// ✅ fetch contacts
export const fetchContacts = async () => {
    store.dispatch(setIsContactsLoading(true));

    try {
        const res = await axiosInstance.get(`/contact-info`);
        if (res.status === 200) store.dispatch(setContacts(res.data.data));
    } catch (error) {
        console.error("Error fetching contact info:", error);
    } finally {
        store.dispatch(setIsContactsLoading(false));
    }
};

// ✅ update contacts
export const updateContacts = async (data) => {
    try {
        const response = await axiosInstance.put(`/contact-info`, data, { validateStatus: status => status >= 200 && status < 500 });
        if (!response) return { status: false, message: 'No response received from server' };

        if (response.status === 200) {
            return { status: true, message: response.data.message || 'Contacts changed successfully' };
        } else {
            return { status: false, message: response.data.message || 'Contacts change request failed' };
        }

    } catch (error) {
        console.error('Contacts change error:', error);
        const errorMessage = error.response?.data?.message || error.message || 'Failed to Change Contacts request';
        return { status: false, message: errorMessage };
    }
};


//✅ create cloudinary
export const upsertCloudinary = async (data) => {
    try {
        const response = await axiosInstance.post(`/settings/cloudinary`, data, { validateStatus: status => status >= 200 && status < 500 });
        if (!response) return { status: false, message: 'No response received from server' };

        if (response.status === 201) {
            return { status: true, message: response.data.message || 'Cloudinary settings created successfully' };
        } else {
            return { status: false, message: response.data.message || 'Cloudinary settings create request failed' };
        }

    } catch (error) {
        console.error('Cloudinary error:', error);
        const errorMessage = error.response?.data?.message || error.message || 'Failed to Create Cloudinary Settings request';
        return { status: false, message: errorMessage };
    }
};



//✅ fetch cloudinary
export const fetchCloudinary = async () => {
    store.dispatch(setIsCloudinaryLoading(true));

    try {
        const res = await axiosInstance.get(`/settings/cloudinary`);
        if (res.status === 200) store.dispatch(setCloudinary(res.data.data[0]));
    } catch (error) {
        console.error("Error fetching contact info:", error);
    } finally {
        store.dispatch(setIsCloudinaryLoading(false));
    }
};


//✅ create email settings
export const upsertEmailSettings = async (data) => {
    try {
        const response = await axiosInstance.post(`/settings/email`, data, { validateStatus: status => status >= 200 && status < 500 });
        if (!response) return { status: false, message: 'No response received from server' };

        if (response.status === 201) {
            return { status: true, message: response.data.message || 'Email settings created successfully' };
        } else {
            return { status: false, message: response.data.message || 'Email settings create request failed' };
        }

    } catch (error) {
        console.error('Email error:', error);
        const errorMessage = error.response?.data?.message || error.message || 'Failed to Create Email Settings request';
        return { status: false, message: errorMessage };
    }
}

//✅ fetch email settings
export const fetchEmailSettings = async () => {
    store.dispatch(setIsEmailLoading(true));

    try {
        const res = await axiosInstance.get(`/settings/email`);
        if (res.status === 200) store.dispatch(setEmailSettings(res.data.data[0]));
    } catch (error) {
        console.error("Error fetching contact info:", error);
    } finally {
        store.dispatch(setIsEmailLoading(false));
    }
};