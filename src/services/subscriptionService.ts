import apiClient from '../utils/api';
import {getTokens} from '../utils/keychain';

const v1Config = {
  headers: {
    Version: 'v1',
    'Cache-Control': 'no-cache', // 캐시 방지
    Pragma: 'no-cache', // HTTP/1.0 캐시 방지
  },
};

export const getSubscriptionListV1 = async (
  isUserSubscription: boolean | undefined,
) => {
  try {
    const tokens = await getTokens();

    if (!tokens) {
      throw '토큰이 없습니다.';
    }

    return await apiClient.get(
      `/subscription${
        isUserSubscription ? `?isUserSubscription=${isUserSubscription}` : ''
      }`,
      {
        headers: {
          ...v1Config.headers,
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      },
    );
  } catch (error) {
    throw error;
  }
};

export const getSubscriptionDetailV1 = async (partnerId: number) => {
  try {
    const tokens = await getTokens();

    if (!tokens) {
      throw '토큰이 없습니다.';
    }

    return await apiClient.get(`/subscription/${partnerId}`, {
      headers: {
        ...v1Config.headers,
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });
  } catch (error) {
    throw error;
  }
};

export const subsribeV1 = async (partnerIds: number[]) => {
  try {
    const tokens = await getTokens();

    if (!tokens) {
      throw '토큰이 없습니다.';
    }

    return await apiClient.post(
      '/subscription',
      {
        partnerIds,
      },
      {
        headers: {
          ...v1Config.headers,
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      },
    );
  } catch (error) {
    throw error;
  }
};

export const unsubsribeV1 = async (partnerIds: number[]) => {
  try {
    const tokens = await getTokens();

    if (!tokens) {
      throw '토큰이 없습니다.';
    }

    return await apiClient.delete('/subscription', {
      headers: {
        ...v1Config.headers,
        Authorization: `Bearer ${tokens.accessToken}`,
      },
      data: {
        partnerIds,
      },
    });
  } catch (error) {
    throw error;
  }
};
