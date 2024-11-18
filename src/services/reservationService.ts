import Toast from 'react-native-toast-message';
import {getTokens} from '../utils/keychain';
import apiClient from '../utils/api';
import {getRefreshAccessToken} from './authService';

export const getReservationListV1 = async (date?: string) => {
  try {
    const token = await getTokens();

    if (!token) {
      throw '토큰이 없습니다.';
    }

    const headers = {
      Version: 'v1',
      Authorization: `Bearer ${token.accessToken}`,
    };
    let res = await apiClient.get(
      `/reservation${date ? `?date=${date}` : ''}`,
      {
        headers,
      },
    );

    if (401 === res.status) {
      const newAccessToken = await getRefreshAccessToken(token?.refreshToken);
      headers.Authorization = `Bearer ${newAccessToken}`;
      res = await apiClient.get(`/reservation${date ? `?date=${date}` : ''}`, {
        headers,
      });
    }

    return res.data;
  } catch (errorMsg: any) {
    Toast.show({
      type: 'error',
      text1: '예약리스트 오류',
      text2: errorMsg,
      position: 'top',
    });
  }
};

export const getReservationDetailV1 = async (reservationId: number) => {
  try {
    const token = await getTokens();

    if (!token) {
      throw '토큰이 없습니다.';
    }

    const headers = {
      Version: 'v1',
      Authorization: `Bearer ${token.accessToken}`,
    };
    let res = await apiClient.get(`/reservation/${reservationId}`, {
      headers,
    });

    if (401 === res.status) {
      const newAccessToken = await getRefreshAccessToken(token?.refreshToken);
      headers.Authorization = `Bearer ${newAccessToken}`;
      res = await apiClient.get(`/reservation/${reservationId}`, {
        headers,
      });
    }

    return res.data;
  } catch (errorMsg: any) {
    Toast.show({
      type: 'error',
      text1: '예약상세 오류',
      text2: errorMsg,
      position: 'top',
    });
  }
};

export const requestReservationV1 = async (placeId: number) => {
  try {
    const token = await getTokens();

    if (!token) {
      throw '토큰이 없습니다.';
    }

    const headers = {
      Version: 'v1',
      Authorization: `Bearer ${token.accessToken}`,
    };
    let res = await apiClient.post(
      `/reservation`,
      {placeId},
      {
        headers,
      },
    );

    if (401 === res.status) {
      const newAccessToken = await getRefreshAccessToken(token?.refreshToken);
      headers.Authorization = `Bearer ${newAccessToken}`;
      res = await apiClient.post(
        `/reservation`,
        {placeId},
        {
          headers,
        },
      );
    }

    return res.data;
  } catch (errorMsg: any) {
    Toast.show({
      type: 'error',
      text1: '예약요청 오류',
      text2: errorMsg,
      position: 'top',
    });
  }
};

export const cancelReservationV1 = async (reservationId: number) => {
  try {
    const token = await getTokens();

    if (!token) {
      throw '토큰이 없습니다.';
    }

    const headers = {
      Version: 'v1',
      Authorization: `Bearer ${token.accessToken}`,
    };
    let res = await apiClient.patch(
      `/reservation/cancle`,
      {reservationId},
      {
        headers,
      },
    );

    if (401 === res.status) {
      const newAccessToken = await getRefreshAccessToken(token?.refreshToken);
      headers.Authorization = `Bearer ${newAccessToken}`;
      res = await apiClient.patch(
        `/reservation/cancle`,
        {reservationId},
        {
          headers,
        },
      );
    }

    return res.data;
  } catch (errorMsg: any) {
    Toast.show({
      type: 'error',
      text1: '예약취소 오류',
      text2: errorMsg,
      position: 'top',
    });
  }
};
