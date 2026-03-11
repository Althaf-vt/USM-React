import API from '..//../app/axios';

const API_URL = "http://localhost:5000/api/auth/";

// Register 
const register = async(userData) => {
    const response = await API.post(API_URL + 'register', userData);
    return response.data;
}

const loginUser = async (userData) => {
    const response = await API.post(API_URL + 'login', userData);

    if(response.data.token){
        localStorage.setItem("userSession", JSON.stringify(response.data));
    }
    return response.data;
}

const loginAdmin = async(userData) => {
    const response = await API.post(API_URL + "admin/login", userData);

    if(response.data.token){
        localStorage.setItem("adminSession", JSON.stringify(response.data));
    }
    return response.data;
}

// Logout
const logout = ()=> {
    localStorage.removeItem("user");
}

const authService = {
    register, loginUser, loginAdmin, logout
}

export default authService;