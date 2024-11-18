import {AUTH_PROVIDER} from '../enums/authEnum';
import {LoginScreenNavigationProp} from './navigationType';

export interface DeviceInfo {
  os: string;
  osVersion: string;
  brand: string;
  model: string;
  uid: string;
  version: string;
  ipAddress: string;
  buildId: string;
  bundleId: string;
  carrierName: string | null;
  type: string;
  freeDiskStorage: number;
  firstInstallTime: number;
  emulator: boolean;
  abis: string;
}

/**
 * 회원가입(Signup)
 */
export interface SignupParams {
  provider: AUTH_PROVIDER;
  name: string;
  pictureUrl?: string | null;
  email: string;
  password?: string;
  socialUId?: string;
  agreeTerms: boolean;
  agreePrivacy: boolean;
  agreeLocation: boolean;
  agreeMarketing: boolean;
}

/**
 * 로그인(Login)
 */
export interface LoginApiParams {
  provider: AUTH_PROVIDER;
  token: string;
  deviceInfo: DeviceInfo;
}

export interface LoginEmailHookParams {
  provider: AUTH_PROVIDER.EMAIL;
  email: string;
  password: string;
  isAutoLogin: boolean;
}

export interface LoginGoogleHookParams {
  provider: AUTH_PROVIDER.GOOGLE;
  navigation: LoginScreenNavigationProp;
  isAutoLogin: boolean;
}

export interface AutoLoginApiParams {
  refreshToken: string;
  deviceInfo: DeviceInfo;
}

export type LoginActionParams = LoginEmailHookParams | LoginGoogleHookParams;

/**
 * 로그아웃(Logout)
 */
export interface LogoutApiParams {
  refreshToken: string;
  deviceInfo: DeviceInfo;
}

/**
 *  프로필
 */
export interface ProfileApiParams {
  file?: {
    uri: string;
    type: string;
    name: string;
  };
  birthDate?: Date;
  agreeMarketing?: boolean;
}
