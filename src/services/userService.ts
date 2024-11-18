import apiClient from '../utils/api';

const v1Config = {
  headers: {
    Version: 'v1',
  },
};

export const getUserProfileV1 = async (accessToken: string) => {
  return await apiClient.get('/user/profile', {
    headers: {
      ...v1Config.headers,
      authorization: `Bearer ${accessToken}`,
    },
  });
};

export const updateUserProfileV1 = async (
  accessToken: string,
  data: FormData,
) => {
  return await apiClient.patch('/user/profile', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
      ...v1Config.headers,
      authorization: `Bearer ${accessToken}`,
    },
  });
};
