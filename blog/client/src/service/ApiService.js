import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { clearAuth, getRefreshToken, getToken, setRefreshToken, setToken } from "../service/AuthUtil";
import { logout } from "../slices/Auth";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import store from '../store';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (cb) => {
    refreshSubscribers.push(cb);
};

const onRefreshed = (newToken) => {
    refreshSubscribers.forEach(cb => cb(newToken));
    refreshSubscribers = [];
};



const refreshToken = async () => {
    try {
        const token = getRefreshToken();
        if (!token) throw new Error("No refresh token found");

        const res = await axios.post(`${API_BASE_URL}/users/refresh-token`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (res.status == 200) {
            const newAccessToken = res.data.response.token;
            const newRefreshToken = res.data.response.refresh_token;
            setToken(newAccessToken);
            setRefreshToken(newRefreshToken);
            return newAccessToken;
        } else {
            store.dispatch(logout());
            clearAuth();
            return null;
        }
    } catch (error) {
        if (error.response && error.response.status != 200) {
            store.dispatch(logout());
            clearAuth();
        }
        return null;
    }
};

apiClient.interceptors.request.use(async (config) => {
    let token = getToken();
    if (!token) return config;

    try {
        const decoded = jwtDecode(token);
        const now = Date.now() / 1000;
        if (decoded.exp < now) {
            if (!isRefreshing) {
                isRefreshing = true;
                const newToken = await refreshToken();
                if (newToken) {
                    token = newToken;
                    isRefreshing = false;
                    onRefreshed(newToken);
                }
            } else {
                return new Promise((resolve) => {
                    subscribeTokenRefresh((newToken) => {
                        config.headers.Authorization = `Bearer ${newToken}`;
                        resolve(config);
                    });
                });
            }
        }
    } catch (err) {
        console.log(err)
        return config;
    }

    config.headers.Authorization = `Bearer ${token}`;
    return config;
});

const handleError = (error) => {
    if (error.response) {
        return {
            success: false,
            status: error.response.status,
            message: error.response.data?.msg || "An error occurred",
            data: error.response.data,
        };
    } else if (error.request) {
        return {
            success: false,
            status: 500,
            message: "No response from server. Please check your connection.",
        };
    } else {
        return {
            success: false,
            status: 500,
            message: error.message || "Unexpected error occurred.",
        };
    }
};

export const getApi = async (endpoint, params = {}, authRequired = false) => {
    try {
        const headers = authRequired
            ? { Authorization: `Bearer ${getToken()}` }
            : {};
        const response = await apiClient.get(endpoint, { params, headers });
        return response.status === 200
            ? { success: true, data: response.data }
            : handleError(response);
    } catch (error) {
        return handleError(error);
    }
};

export const postApi = async (endpoint, data = {}, params = {}, authRequired = false) => {
    try {
        const headers = authRequired
            ? { Authorization: `Bearer ${getToken()}` }
            : {};

        const response = await apiClient.post(endpoint, data, { params, headers });

        return response.status === 200 || response.status === 201
            ? { success: true, data: response.data }
            : handleError(response);
    } catch (error) {
        return handleError(error);
    }
};

export default apiClient;
