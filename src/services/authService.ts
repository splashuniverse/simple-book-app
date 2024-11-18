import apiClient from '../utils/api';
import {
  AutoLoginApiParams,
  LoginApiParams,
  LogoutApiParams,
  SignupParams,
} from '../types/authType';

const v1Config = {
  headers: {
    Version: 'v1',
  },
};

export const loginV1 = async (params: LoginApiParams) => {
  return await apiClient.post('/auth/login', params, v1Config);
};

export const autoLoginV1 = async (params: AutoLoginApiParams) => {
  return await apiClient.post(
    '/auth/auto-login',
    {
      deviceInfo: params.deviceInfo,
    },
    {
      headers: {
        ...v1Config.headers,
        authorization: `Bearer ${params.refreshToken}`,
      },
    },
  );
};

export const signupV1 = async (params: SignupParams) => {
  return await apiClient.post('/auth/signup', params, v1Config);
};

export const logoutV1 = async (params: LogoutApiParams) => {
  return await apiClient.delete('/auth/logout', {
    ...v1Config,
    data: params,
  });
};

export const getTerms = async () => {
  return await apiClient.get('/auth/terms');
};

export const checkAvailableEmail = async (email: string) => {
  return await apiClient.post('/auth/check-available-email', {email});
};

export const getRefreshAccessToken = async (refreshToken: string) => {
  const params = {refreshToken};
  return await apiClient.post('/auth/refresh-token', params, v1Config);
};
