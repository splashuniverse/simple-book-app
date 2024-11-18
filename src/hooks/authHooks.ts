import Toast from 'react-native-toast-message';
import {signupV1, getTerms, checkAvailableEmail} from '../services/authService';
import {SignupParams} from '../types/authType';

export const signupHooks = async (params: SignupParams) => {
  try {
    const apiRes = await signupV1(params);
    return apiRes.data;
  } catch (errorMsg: any) {
    Toast.show({
      type: 'error',
      text1: '회원가입 오류',
      text2: errorMsg,
      position: 'top',
    });
    throw errorMsg;
  }
};

export const getTermsHooks = async () => {
  try {
    const apiRes = await getTerms();
    return apiRes.data;
  } catch (errorMsg: any) {
    Toast.show({
      type: 'error',
      text1: '이용약관 오류',
      text2: errorMsg,
      position: 'top',
    });
    throw errorMsg;
  }
};

export const checkAvailableEmailHooks = async (email: string) => {
  try {
    const apiRes = await checkAvailableEmail(email);
    return apiRes.data.message;
  } catch (errorMsg) {
    return errorMsg;
  }
};
