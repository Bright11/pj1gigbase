import { useAuthStore } from '@/store/auth.store';
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store'


// const API_BASE_URL = "https://190c-154-162-62-115.ngrok-free.app"; 

const API_BASE_URL ='https://5de1-154-162-47-10.ngrok-free.app';


const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

export const publicAPI = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
     'ngrok-skip-browser-warning': 'true',
  },
  timeout: 15000,
});


// ==========================================
// REQUEST INTERCEPTOR
// ==========================================

api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const accessToken =
      await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);

    if (accessToken) {
      config.headers.Authorization =
        `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);


// ==========================================
// RESPONSE INTERCEPTOR
// ==========================================

api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest =
      error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };

    // Only handle 401 responses
    if (
      error.response?.status !== 401 ||
      !originalRequest
    ) {
      return Promise.reject(error);
    }

    // Prevent infinite refresh loops
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const refreshToken =
        await SecureStore.getItemAsync(
          REFRESH_TOKEN_KEY
        );

      // No refresh token available
      if (!refreshToken) {
        return Promise.reject(error);
      }

      // Ask Django for a new access token
      const response = await publicAPI.post<{
        access: string;
      }>(
        '/api/token/refresh/',
        {
          refresh: refreshToken,
        }
      );

      // const newAccessToken =
      //   response.data.access;

      // // Save new access token
      // await SecureStore.setItemAsync(
      //   ACCESS_TOKEN_KEY,
      //   newAccessToken
      // );
const newAccessToken =
  response.data.access;

// Save new access token
await SecureStore.setItemAsync(
  ACCESS_TOKEN_KEY,
  newAccessToken
);

// Keep Zustand in sync
useAuthStore
  .getState()
  .setTokens(
    newAccessToken,
    refreshToken,
  );
      // Put new token on original request
      originalRequest.headers.Authorization =
        `Bearer ${newAccessToken}`;

      // Retry original request
      return api(originalRequest);

    } catch (refreshError) {
      // Refresh token itself is invalid/expired
      await SecureStore.deleteItemAsync(
        ACCESS_TOKEN_KEY
      );

      await SecureStore.deleteItemAsync(
        REFRESH_TOKEN_KEY
      );

      return Promise.reject(refreshError);
    }
  }
);