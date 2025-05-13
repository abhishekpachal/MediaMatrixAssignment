import { jwtDecode } from 'jwt-decode';
import LocalStorageService from '../service/LocalStorage';

const AUTH_STATE = 'authState';
const REFRESH_TOKEN = 'refreshToken';

export const isLoggedIn = () => {
    const authState = LocalStorageService.getItem(AUTH_STATE);
    if (!authState) return false;

    try {
        const { token } = JSON.parse(authState);
        if (!token) return false;
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        return decoded.exp && decoded.exp > currentTime;
    } catch (err) {
        return false;
    }
};

export const getToken = () => {
    const authState = LocalStorageService.getItem(AUTH_STATE);
    if (!authState) return null;
    try {
        const { token } = JSON.parse(authState);
        return token;
    } catch {
        return null;
    }
};

export const setToken = (token) => {
    try {
        const authState = LocalStorageService.getItem(AUTH_STATE);
        if (authState) {
            const parsedAuthState = JSON.parse(authState);
            parsedAuthState.token = token;
            LocalStorageService.setItem(AUTH_STATE, JSON.stringify(parsedAuthState));
        } else {
            LocalStorageService.setItem(AUTH_STATE, JSON.stringify({ token }));
        }
    } catch { }
}

export const getRefreshToken = () => {
    return LocalStorageService.getItem(REFRESH_TOKEN);
};

export const setRefreshToken = (refresh_token) => {
    return LocalStorageService.setItem(REFRESH_TOKEN, refresh_token);
};

export const getUser = () => {
    const authState = LocalStorageService.getItem(AUTH_STATE);
    if (!authState) return null;
    try {
        const { user } = JSON.parse(authState);
        return user;
    } catch {
        return null;
    }
};

export const setAuthState = (newAuth) => {
    try {
        LocalStorageService.setItem(AUTH_STATE, JSON.stringify(newAuth));
    } catch { }
};


export const clearAuth = () => {
    LocalStorageService.removeItem(AUTH_STATE);
    LocalStorageService.removeItem(REFRESH_TOKEN);
};