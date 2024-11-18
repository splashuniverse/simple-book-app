import {create} from 'zustand';
import {AUTH_PROVIDER} from '../enums/authEnum';
import {getTokens} from '../utils/keychain';
import Toast from 'react-native-toast-message';
import {getUserProfileV1, updateUserProfileV1} from '../services/userService';
import {launchImageLibrary} from 'react-native-image-picker';
import {Alert} from 'react-native';
import {ProfileApiParams} from '../types/authType';

interface UserState {
  profile: {
    name: string;
    pictureUrl: string;
    email: string;
    provider: AUTH_PROVIDER;
    birthDate: Date;
    agreeTerms: boolean;
    agreePrivacy: boolean;
    agreeLocation: boolean;
    agreeMarketing: boolean;
    createdAt: Date;
    terms: {
      terms: string;
      privacy: string;
      location: string;
      marketing: string;
    };
  };
  getProfile: () => Promise<void>;
  updateProfile: (params: ProfileApiParams) => Promise<void>;
}

export const useUserStore = create<UserState>(set => ({
  profile: {
    name: '',
    pictureUrl: '',
    email: '',
    provider: AUTH_PROVIDER.GOOGLE,
    birthDate: new Date(),
    agreeTerms: true,
    agreePrivacy: true,
    agreeLocation: true,
    agreeMarketing: true,
    createdAt: new Date(),
    terms: {
      terms: '',
      privacy: '',
      location: '',
      marketing: '',
    },
  },

  getProfile: async () => {
    try {
      const tokens = await getTokens();

      if (tokens) {
        const apiResult = await getUserProfileV1(tokens.accessToken);
        set({
          profile: apiResult.data,
        });
      }
    } catch (errorMsg: any) {
      Toast.show({
        type: 'error',
        text1: '프로필 오류',
        text2: errorMsg,
        position: 'top',
      });
      throw errorMsg;
    }
  },

  updateProfile: async (params: ProfileApiParams) => {
    try {
      const tokens = await getTokens();
      if (!tokens) throw '토큰이 없습니다.';

      const formData = new FormData();
      if (params.birthDate) {
        formData.append('birthDate', params.birthDate.toISOString()); // Date 객체를 문자열로 변환
      }
      if (params.agreeMarketing !== undefined) {
        formData.append('agreeMarketing', params.agreeMarketing.toString());
      }
      if (params.file) {
        formData.append('file', {
          uri: params.file.uri,
          type: params.file.type,
          name: params.file.name,
        } as any);
      }

      const apiResult = await updateUserProfileV1(tokens.accessToken, formData);
      set({profile: apiResult.data});
    } catch (errorMsg: any) {
      Toast.show({
        type: 'error',
        text1: '프로필 오류',
        text2: errorMsg,
        position: 'top',
      });
      throw errorMsg;
    }
  },
}));
