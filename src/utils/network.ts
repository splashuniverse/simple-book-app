import {Alert} from 'react-native';
import NetInfo from '@react-native-community/netinfo';

// 인터넷 연결 확인
export const checkInternetConnection = async (): Promise<boolean> => {
  const state = await NetInfo.fetch();
  if (!state.isConnected) {
    Alert.alert('인터넷 연결 오류', '인터넷에 연결할 수 없습니다.');
    return false;
  }
  return true;
};

// 인터넷 상태 모니터링
export const monitorInternetConnection = (
  setIsConnected: (connected: boolean) => void,
) => {
  const unsubscribe = NetInfo.addEventListener(state => {
    if (state.isConnected) {
      setIsConnected(true);
    } else {
      setIsConnected(false);
      Alert.alert('인터넷 연결 오류', '인터넷이 끊어졌습니다.');
    }
  });

  return unsubscribe;
};
