import API from "../../app/axios";

const getProfile = async () => {
    const response = await API.get('/users/profile');
    return response.data;
}

const getAdminProfile = async () => {
    const response = await API.get('/admin/profile');
    return response.data;
}

const updateUserProfile = async (formData) => {
    const response = await API.put('/users/profile', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
}

const updateAdminProfile = async (formData) => {
    const response = await API.put('/admin/profile', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
}

export default {
    getProfile,
    updateUserProfile,
    updateAdminProfile,
    getAdminProfile,
}