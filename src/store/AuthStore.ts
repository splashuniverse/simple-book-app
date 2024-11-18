import {create} from 'zustand';
import auth from '@react-native-firebase/auth';
import Toast from 'react-native-toast-message';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {AxiosResponse} from 'axios';
import {getTokens, deleteTokens, saveTokens} from '../utils/keychain';
import {LoginActionParams} from '../types/authType';
import {AUTH_PROVIDER} from '../enums/authEnum';
import {autoLoginV1, loginV1, logoutV1} from '../services/authService';
import {LoginScreenNavigationProp} from '../types/navigationType';
import {getDeviceInfo} from '../utils/device';
import {SCREEN_TITLES} from '../constants/navigationConstants';
import {Platform} from 'react-native';

interface AuthState {
  isLogin: boolean;
  login: (params: LoginActionParams) => Promise<void>;
  autoLogin: () => Promise<void>;
  logout: () => Promise<void>;
}

if (Platform.OS === 'android') {
  GoogleSignin.configure({
    webClientId:
      '718954545694-jhuc0notgp1v2cf0cpod8a501jsnd62t.apps.googleusercontent.com',
  });
}

export const useAuthStore = create<AuthState>(set => ({
  isLogin: false,

  login: async (params: LoginActionParams) => {
    const {provider, isAutoLogin} = params;
    const deviceInfo = getDeviceInfo();
    const loginApiParams = {provider, deviceInfo, token: ''};
    let apiRes: AxiosResponse | null = null;
    let signupParams = {
      provider,
      name: '',
      email: '',
      pictureUrl: '',
      socialUId: '',
    };
    let navigation: LoginScreenNavigationProp | null = null;

    try {
      if (params.provider === AUTH_PROVIDER.EMAIL) {
        const {email, password} = params;
        const resFromFirebase = await auth().signInWithEmailAndPassword(
          email,
          password,
        );
        const idToken = await resFromFirebase.user.getIdToken(true);

        apiRes = await loginV1({...loginApiParams, token: idToken});
      } else if (params.provider === AUTH_PROVIDER.GOOGLE) {
        navigation = params.navigation;

        await GoogleSignin.hasPlayServices();

        const userInfo = await GoogleSignin.signIn();

        if (userInfo.data?.idToken === null || !userInfo.data?.idToken) {
          return;
        }

        const resFromFirebase = await auth().signInWithCredential(
          auth.GoogleAuthProvider.credential(userInfo.data.idToken),
        );
        const idToken = await resFromFirebase.user.getIdToken();

        // 존재하지 않는 계정인 경우 회원가입으로 진행
        signupParams = {
          ...signupParams,
          name: userInfo.data.user.name || '',
          email: userInfo.data.user.email || '',
          pictureUrl: userInfo.data.user.photo || '',
          socialUId: resFromFirebase.user.uid,
        };

        apiRes = await loginV1({...loginApiParams, token: idToken});
      }

      if (apiRes && apiRes.data && isAutoLogin) {
        await saveTokens(apiRes.data.accessToken, apiRes.data.refreshToken);
      }

      set({isLogin: true});
    } catch (errorMsg: any) {
      if (
        provider === AUTH_PROVIDER.GOOGLE &&
        navigation &&
        errorMsg === '존재하지 않는 계정입니다.'
      ) {
        navigation.navigate(SCREEN_TITLES.SIGNUP, signupParams);
      } else {
        Toast.show({
          type: 'error',
          text1: '로그인 오류',
          text2: errorMsg,
          position: 'top',
        });
        throw errorMsg;
      }
    }
  },

  autoLogin: async () => {
    try {
      const deviceInfo = getDeviceInfo();
      const tokens = await getTokens();

      if (!tokens) {
        return null;
      }

      await autoLoginV1({
        deviceInfo,
        refreshToken: tokens.refreshToken,
      });
      set({isLogin: true});
    } catch (errorMsg: any) {
      Toast.show({
        type: 'error',
        text1: '자동로그인 오류',
        text2: errorMsg,
        position: 'top',
      });
      throw errorMsg;
    }
  },

  logout: async () => {
    const deviceInfo = getDeviceInfo();

    try {
      const token = await getTokens();
      if (!token) {
        throw '토큰이 없습니다.';
      }

      const {refreshToken} = token;
      const apiResult = await logoutV1({
        refreshToken,
        deviceInfo,
      });

      if (apiResult.status === 200) {
        await deleteTokens();
      } else {
        throw '로그아웃에 문제가 발생했습니다.';
      }
    } catch (errorMsg: any) {
      Toast.show({
        type: 'error',
        text1: '로그아웃 오류',
        text2: errorMsg,
        position: 'top',
      });
    }
    await deleteTokens(); // Keychain에서 토큰 삭제
    set({isLogin: false});
  },
}));
