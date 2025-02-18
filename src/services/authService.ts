import { apiCall } from '../apiClient';

export type SignInResponse = {
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  accessToken: string;
};

export type SignUpResponse = {
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
};

export type SignInPayload = {
  email: string;
  password: string;
};

export type SignUpPayload = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export type GetUserResponse = {
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
};

const AuthApiService = {
  signUp: (payload: SignUpPayload) =>
    apiCall<SignUpPayload, SignUpResponse>('post', '/users/register', payload),

  signIn: (payload: SignInPayload) =>
    apiCall<SignInPayload, SignInResponse>('post', '/users/login', payload),

  renewToken: () =>
    apiCall<null, { accessToken: string }>('get', '/refresh-token'),

  getUser: () => {
    return apiCall<null, SignInResponse>('get', '/users/me');
  },

  signOut: () => {},
  resetPassword: () => {},
  updatePassword: () => {},
};

export default AuthApiService;
