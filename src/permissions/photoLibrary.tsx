import {Alert, Platform} from 'react-native';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';

export async function requestPhotoLibraryPermission() {
  try {
    const permission =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.PHOTO_LIBRARY
        : PERMISSIONS.ANDROID.READ_MEDIA_IMAGES;

    // 권한 상태 확인
    const result = await check(permission);

    if (result === RESULTS.GRANTED) {
      // 권한이 이미 승인됨
      return true;
    } else if (result === RESULTS.DENIED || result === RESULTS.LIMITED) {
      // 권한이 거부되었거나 제한됨 -> 권한 요청
      const requestResult = await request(permission);

      return requestResult === RESULTS.GRANTED;
    } else if (result === RESULTS.BLOCKED) {
      // 권한이 차단됨 -> 설정에서 직접 변경하도록 안내
      Alert.alert(
        '권한 필요',
        '앨범에 접근하려면 설정에서 권한을 허용해야 합니다.',
        [{text: '확인'}],
      );
      return false;
    }

    return false;
  } catch (error) {
    console.error('Permission error:', error);
    return false;
  }
}
