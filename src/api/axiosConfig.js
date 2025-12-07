import axios from "axios";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const axiosInstance = axios.create({
    baseURL: `${BASE}/api`,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (
            (error.response && error.response.status === 401) ||
            error.response?.status === 403
        ) {
            console.warn("Authentication expired or invalid.");
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
