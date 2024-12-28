import axios, { AxiosResponse } from 'axios';

export const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const api = axios.create({
  baseURL: BASE_URL,
});

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
