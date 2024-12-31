import axios, { AxiosResponse } from 'axios';
import useBoundStore from './store';

export const BASE_URL = import.meta.env.VITE_API_BASE_URL;
axios.defaults.withCredentials = true;

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (token) {
      promise.resolve(token);
    } else {
      promise.reject(error);
    }
  });

  failedQueue = [];
};

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    const token = useBoundStore.getState().token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => response, // Return the response if no error
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      // Prevent multiple retries
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.log('Refreshing token...');
        const response = await api.post(
          'users/refresh-token',
          {},
          { withCredentials: true }
        );
        const newToken = response.data.accessToken;

        // Update the store with the new token
        useBoundStore.getState().setToken(newToken);

        // Process the queued requests
        processQueue(null, newToken);

        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (err) {
        console.log('Error refreshing token', err);
        processQueue(err, null);

        // Clear the token in the store and redirect to login
        useBoundStore.getState().setToken(null);
        // window.location.href = '/signin'; // Adjust the login route as needed
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export type ApiMethod = 'get' | 'post' | 'put' | 'delete';

export const apiCall = <TPayload, TResponse>(
  method: ApiMethod,
  url: string,
  payload?: TPayload
): Promise<AxiosResponse<TResponse>> => {
  return api.request<TResponse>({
    method,
    url,
    data: payload,
  });
};
