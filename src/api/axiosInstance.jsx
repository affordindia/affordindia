// src/api/axiosInstance.js
import axios from "axios";

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // Environment-based base URL
  
});

//  Attach token dynamically if using authentication
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); //  can replace this with context/token store
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


export default axiosInstance;
