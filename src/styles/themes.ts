import {createTheme} from '@rneui/themed';

export const lightTheme = createTheme({
  mode: 'light',
  lightColors: {
    primary: '#6200ee', // 메인 액센트 색상 (보라색 계열)
    secondary: '#03dac6', // 서브 액센트 색상 (청록색 계열)
    background: '#ffffff', // 전체 배경색 (화이트)
    success: '#4caf50', // 성공 색상 (녹색)
    warning: '#ff9800', // 경고 색상 (주황색)
    error: '#f44336', // 오류 색상 (빨간색)
    divider: '#e0e0e0', // 구분선 색상 (연한 회색)
  },
});

export const darkTheme = createTheme({
  mode: 'dark',
  darkColors: {
    primary: '#bb86fc', // 메인 액센트 색상 (연보라색)
    secondary: '#03dac6', // 서브 액센트 색상 (청록색)
    background: '#121212', // 전체 배경색 (어두운 회색)
    success: '#4caf50', // 성공 색상 (녹색)
    warning: '#ffa726', // 경고 색상 (밝은 주황색)
    error: '#e57373', // 오류 색상 (밝은 빨간색)
    divider: '#424242', // 구분선 색상 (중간 회색)
  },
});
