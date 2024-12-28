import { api, apiCall } from '../apiClient';

export type SignInResponse = {
  statusCode: number;
  data: {
    user: {
      firstName: string;
      lastName: string;
      email: string;
    };
    accessToken: string;
  };
  message: string;
};

export type SignUpResponse = {
  statusCode: number;
  data: {
    user: {
      firstName: string;
      lastName: string;
      email: string;
    };
  };
  message: string;
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

const AuthApiService = {
  signUp: (payload: SignUpPayload) =>
    apiCall<SignUpPayload, SignUpResponse>('post', '/users/register', payload),

  signIn: (payload: SignInPayload) =>
    apiCall<SignInPayload, SignInResponse>('post', '/users/login', payload),

  renewToken: () =>
    apiCall<null, { accessToken: string }>('get', '/refresh-token'),

  signOut: () => {},
  resetPassword: () => {},
  updatePassword: () => {},
};

export default AuthApiService;
