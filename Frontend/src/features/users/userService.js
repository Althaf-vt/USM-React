import API from "../../app/axios";


// Get all users (Admin only)
const getUsers = async (search = "", page = 1) => {
    const response = await API.get(`/admin/dashboard?search=${search}&page=${page}`);
    return response.data;
}

// Delete user
const deleteUser = async (id) => {
    const response = await API.delete(`/admin/users/${id}`);
    return response.data;
}

// Create user 
const createUser = async(userData) => {
    const response = await API.post('/admin/users',userData);
    return response.data;
}

const updateUser = async(id, userData) => {
    const response = await API.put(`/admin/users/${id}`,userData);
    return response.data;
}

export default {
    getUsers, deleteUser, createUser, updateUser
}