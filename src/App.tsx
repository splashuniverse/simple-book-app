import React, {useEffect, useState} from 'react';
import {
  Alert,
  LogBox,
  Platform,
  SafeAreaView,
  useColorScheme,
} from 'react-native';
import {ThemeProvider} from '@rneui/themed';
import messaging from '@react-native-firebase/messaging';
import Toast from 'react-native-toast-message';
import AppNavigator, {navigationRef} from './navigator/AppNavigator';
import LoginNavigator from './navigator/AuthNavigator';
import SplashScreen from './screens/SplashScreen'; // 스플래시 화면 컴포넌트 임포트
import {lightTheme, darkTheme} from './styles/themes';
import {useAuthStore} from './store/AuthStore';
import {useLoadingStore} from './store/LoadingStore';
import {useUserStore} from './store/UserStore';
import {Linking} from 'react-native';
import {getAppVersion} from './utils/device';
import {
  checkInternetConnection,
  monitorInternetConnection,
} from './utils/network';
import apiClient from './utils/api';
import {compareVersions} from './utils/common';

// LogBox 설정
if (!__DEV__) {
  LogBox.ignoreAllLogs(true); // 운영 환경에서 모든 경고 무시
} else {
  LogBox.ignoreLogs([
    // 특정 경고 무시 (개발용)
    'Possible unhandled promise rejection',
    'Response Error:',
    'No response received:',
    'Request Setup Error:',
    'Unexpected Error:',
    'Google Signin Error:',
  ]);
}

function App(): React.JSX.Element {
  const [isAppInitialized, setIsAppInitialized] = useState(false); // 초기화 상태 관리
  const [isConnected, setIsConnected] = useState(true); // 네트워크 연결 상태
  const isLogin = useAuthStore(state => state.isLogin);
  const resetLoading = useLoadingStore(state => state.resetLoading);
  const isDarkMode = useColorScheme() === 'dark';
  const theme = isDarkMode ? darkTheme : lightTheme;

  useEffect(() => {
    let unsubscribeOnMessage;

    const initializeApp = async () => {
      try {
        resetLoading();

        // 인터넷 연결 확인
        const connected = await checkInternetConnection();
        if (!connected) {
          return; // 연결이 되지 않으면 초기화 중단
        }

        const appVersionResult = await apiClient.get('/server/app-version');
        const appVersion = appVersionResult.data.version;

        if (
          compareVersions(getAppVersion(), appVersion.minSupportedVersion) < 0
        ) {
          Alert.alert(
            '업데이트 필요',
            '새로운 버전의 앱이 출시되었습니다. 업데이트 후 계속 사용할 수 있습니다.',
            [
              {
                text: '업데이트',
                onPress: () => Linking.openURL(appVersion.updateUrl),
              },
            ],
            {cancelable: false},
          );
        }

        await useAuthStore.getState().autoLogin();
        if (useAuthStore.getState().isLogin) {
          await useUserStore.getState().getProfile();
        }

        if (Platform.OS === 'android') {
          const token = await messaging().getToken();
          console.log('FCM Token:', token);

          messaging().onTokenRefresh(async newToken => {
            console.log('New FCM Token:', newToken);
          });

          // 포그라운드 메시지 핸들러 설정
          unsubscribeOnMessage = messaging().onMessage(async remoteMessage => {
            if (
              remoteMessage.notification?.title &&
              remoteMessage.notification?.body
            ) {
              Alert.alert(
                remoteMessage.notification.title,
                remoteMessage.notification.body,
              );
            }
          });

          messaging().setBackgroundMessageHandler(async remoteMessage => {
            console.log('Message handled in the background!', remoteMessage);
          });
        }
      } catch (error) {
        console.error('앱 초기화 실패: ', error);
      } finally {
        setIsAppInitialized(true);
      }
    };

    const monitorConnection = monitorInternetConnection(setIsConnected);
    let timer: any;

    if (isConnected) {
      timer = setTimeout(initializeApp, 3000);
    }

    return () => {
      clearTimeout(timer);
      if (unsubscribeOnMessage) {
        unsubscribeOnMessage(); // 핸들러 해제
      }
      monitorConnection();
    };
  }, []);

  useEffect(() => {
    console.log('useEffect');

    const deepLink = async () => {
      if (isAppInitialized) {
        const handleDeepLink = (url: string) => {
          if (url === 'sungjufirstapp://profile' && navigationRef.isReady()) {
            navigationRef.navigate('AppTab', {screen: '프로필'});
          }
        };

        const initialUrl = await Linking.getInitialURL();
        initialUrl && handleDeepLink(initialUrl);

        const subscription = Linking.addEventListener('url', ({url}) => {
          handleDeepLink(url);
        });

        return () => {
          subscription.remove();
        };
      }
    };

    deepLink();
  }, [isAppInitialized]);

  // 앱이 초기화되기 전 스플래시 화면을 표시
  if (!isAppInitialized) {
    return <SplashScreen />;
  }

  return (
    <>
      <ThemeProvider theme={theme}>
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: isDarkMode
              ? theme.darkColors?.background
              : theme.lightColors?.background,
          }}>
          {isLogin ? <AppNavigator /> : <LoginNavigator />}
        </SafeAreaView>
      </ThemeProvider>
      <Toast />
    </>
  );
}

export default App;
