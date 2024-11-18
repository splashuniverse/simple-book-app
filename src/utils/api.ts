import {Platform} from 'react-native';
import axios, {Axios} from 'axios';
import {ANDROID_API_URL, IOS_API_URL} from '@env';
import {useLoadingStore} from '../store/LoadingStore';

export const API_URL =
  Platform.OS === 'android' ? ANDROID_API_URL : IOS_API_URL;

// Axios 기본 인스턴스 생성
const apiClient: Axios = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// 요청 인터셉터를 사용해 버전을 동적으로 변경 가능
apiClient.interceptors.request.use(
  config => {
    console.log('\n\n\n==== Axios Request ====');
    console.log('URL:', config.baseURL + config.url);
    console.log('Method:', config.method?.toUpperCase());
    console.log('Headers:', config.headers);
    if (config.data) {
      console.log('Body:', config.data);
    }
    console.log('=======================');

    const {incrementLoading} = useLoadingStore.getState();
    incrementLoading();

    const version = config.headers.Version ? `/${config.headers.Version}` : '';
    config.baseURL = `${API_URL}/api${version}`;

    return config;
  },
  error => {
    const {decrementLoading} = useLoadingStore.getState();
    decrementLoading();

    return Promise.reject(error);
  },
);

// 응답 인터셉터에서 에러를 상세히 처리
apiClient.interceptors.response.use(
  response => {
    const {decrementLoading} = useLoadingStore.getState();
    decrementLoading();

    // 정상적인 응답은 그대로 반환
    return response;
  },
  error => {
    const {decrementLoading} = useLoadingStore.getState();
    decrementLoading();

    let errorMessage = '알 수 없는 오류가 발생했습니다.';

    if (axios.isAxiosError(error)) {
      if (error.response) {
        // 서버가 응답했으나 에러가 발생한 경우
        console.error('Response Error:', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data,
        });

        // 서버의 에러 메시지 추출
        errorMessage =
          error.response.data?.message || '서버에서 오류가 발생했습니다.';
      } else if (error.request) {
        // 요청이 전송되었으나 응답이 없는 경우
        console.error('No response received:', error.request);
        errorMessage = `서버로부터 응답이 없습니다. ${API_URL}`;
      } else {
        // 요청 설정 문제
        console.error('Request Setup Error:', error.message);
        errorMessage = error.message;
      }
    } else {
      console.error('Unexpected Error:', error);
    }
    return Promise.reject(errorMessage);
  },
);

export default apiClient;
