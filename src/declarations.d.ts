declare module '@env' {
  export const ANDROID_API_URL: string;
  export const IOS_API_URL: string;
}

declare module '*.svg' {
  import React from 'react';
  import {SvgProps} from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}
