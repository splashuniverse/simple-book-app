import NaverDarkIcon from '../../assets/icons/naver-dark.svg';
import KakaoLightIcon from '../../assets/icons/kakao-light.svg';
import KakaoDarkIcon from '../../assets/icons/kakao-dark.svg';
import GoogleIcon from '../../assets/icons/google.svg';
import AppleLightIcon from '../../assets/icons/apple-light.svg';
import AppleDarkIcon from '../../assets/icons/apple-dark.svg';
import {AUTH_PROVIDER} from '../enums/authEnum';

export const AUTH_PROVIDER_ICON = {
  [AUTH_PROVIDER.EMAIL]: {
    light: KakaoLightIcon,
    dark: NaverDarkIcon,
  },
  [AUTH_PROVIDER.PHONE]: {
    light: KakaoLightIcon,
    dark: NaverDarkIcon,
  },
  [AUTH_PROVIDER.NAVER]: {
    light: KakaoLightIcon,
    dark: NaverDarkIcon,
  },
  [AUTH_PROVIDER.KAKAO]: {
    light: KakaoLightIcon,
    dark: KakaoDarkIcon,
  },
  [AUTH_PROVIDER.GOOGLE]: {
    light: GoogleIcon,
    dark: GoogleIcon,
  },
  [AUTH_PROVIDER.APPLE]: {
    light: AppleLightIcon,
    dark: AppleDarkIcon,
  },
};
