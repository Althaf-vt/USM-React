import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000/api",
});

// Attach token automatically

API.interceptors.request.use(
    (config) => {
        const userSession = JSON.parse(localStorage.getItem("userSession"));
        const adminSession = JSON.parse(localStorage.getItem("adminSession"));

        if(config.url.startsWith("/admin")){
            if(adminSession?.token){
                config.headers.Authorization = `Bearer ${adminSession.token}`;
            }
        }else{
            if(userSession?.token){
                config.headers.Authorization = `Bearer ${userSession.token}`;
            }
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)


API.interceptors.response.use(
  (response) => response,

  (error) => {

    const requestUrl = error.config?.url || "";

    if (
      error.response?.status === 401 &&
      !requestUrl.includes("/auth/login") &&
      !requestUrl.includes("/auth/admin/login") &&
      !requestUrl.includes("/auth/register")
    ) {

      if (requestUrl.includes("/admin")) {
        localStorage.removeItem("adminSession");
        window.location.href = "/admin/login";
      } else {
        localStorage.removeItem("userSession");
        window.location.href = "/login";
      }

    }

    return Promise.reject(error);
  }
);

export default API;