import React, {useState} from 'react';
import {Alert, ScrollView, StyleSheet, View} from 'react-native';
import {Avatar, Text, ListItem, Divider, Switch, useTheme} from '@rneui/themed';
import DateTimePicker from '@react-native-community/datetimepicker';
import {useAuthStore} from '../store/AuthStore';
import {useUserStore} from '../store/UserStore';
import {ProfileScreenProps} from '../types/navigationType';
import {AUTH_PROVIDER_ICON} from '../constants/authConstants';
import {SCREEN_TITLES} from '../constants/navigationConstants';
import {requestPhotoLibraryPermission} from '../permissions/photoLibrary';
import {launchImageLibrary} from 'react-native-image-picker';
import {formatDateToString} from '../utils/common';
import {
  DATE_FORMAT_DETAIL,
  DATE_FORMAT_SIMPLE,
} from '../constants/commonConstants';

const ProfileScreen: React.FC<ProfileScreenProps> = ({navigation}) => {
  const {theme} = useTheme();
  const {profile, getProfile, updateProfile} = useUserStore();
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const SocialTypeIcon = AUTH_PROVIDER_ICON[profile.provider][theme.mode];

  const formattedCreatedAt = profile.createdAt
    ? formatDateToString(profile.createdAt, DATE_FORMAT_DETAIL)
    : '-';

  const formattedBirthDate = profile.birthDate
    ? formatDateToString(profile.birthDate, DATE_FORMAT_SIMPLE)
    : '-';

  // 생일 편집 핸들러
  const handleEditBirthDate = (event: any, selectedDate?: Date) => {
    setDatePickerVisible(false);
    if (selectedDate) {
      updateProfile({birthDate: selectedDate});
    }
  };

  // 프로필 이미지 변경 핸들러
  const handleProfileImageChange = async () => {
    const hasPermission = await requestPhotoLibraryPermission();

    if (!hasPermission) return;

    const photoResult = await launchImageLibrary({mediaType: 'photo'});
    if (
      photoResult.didCancel ||
      !photoResult.assets ||
      !photoResult.assets[0].uri
    ) {
      Alert.alert('이미지 선택이 취소되었습니다.');
      return;
    }

    const photoUri = photoResult.assets[0].uri;
    const fileType = photoResult.assets[0].type || 'image/jpeg';
    const fileName = photoResult.assets[0].fileName || 'profile.jpg';

    updateProfile({
      file: {
        uri: photoUri,
        type: fileType,
        name: fileName,
      },
    });
  };

  // 마케팅 동의 설정 핸들러
  const handleMarketingConsentChange = (value: boolean) => {
    updateProfile({agreeMarketing: value});
  };

  return (
    <ScrollView style={styles.profileContainer}>
      <View style={styles.profileImageWrap}>
        <Avatar
          size={64}
          rounded
          source={profile.pictureUrl ? {uri: profile.pictureUrl} : {}}
          onPress={handleProfileImageChange}>
          <Avatar.Accessory size={24} />
        </Avatar>
        <Text style={styles.name}>{profile.name}</Text>
      </View>

      <View style={styles.profileUserInfoWrap}>
        <ListItem>
          <ListItem.Content>
            <ListItem.Title>이메일</ListItem.Title>
          </ListItem.Content>
          <ListItem.Content>
            <ListItem.Subtitle>{profile.email}</ListItem.Subtitle>
          </ListItem.Content>
        </ListItem>

        <ListItem>
          <ListItem.Content style={styles.profileInfoListContent}>
            <ListItem.Title>로그인 방식</ListItem.Title>
            <ListItem.Subtitle>
              <SocialTypeIcon width={30} height={30} />
            </ListItem.Subtitle>
          </ListItem.Content>
        </ListItem>

        <ListItem>
          <ListItem.Content style={styles.profileInfoListContent}>
            <ListItem.Title>회원가입 일시</ListItem.Title>
            <ListItem.Subtitle>{formattedCreatedAt}</ListItem.Subtitle>
          </ListItem.Content>
        </ListItem>

        <ListItem onPress={() => setDatePickerVisible(true)}>
          <ListItem.Content style={styles.profileInfoListContent}>
            <ListItem.Title>생일</ListItem.Title>
            {isDatePickerVisible ? (
              <DateTimePicker
                value={
                  profile.birthDate ? new Date(profile.birthDate) : new Date()
                }
                mode="date"
                locale="ko"
                display="default"
                onChange={handleEditBirthDate}
              />
            ) : (
              <ListItem.Subtitle>{formattedBirthDate}</ListItem.Subtitle>
            )}
          </ListItem.Content>
        </ListItem>

        <Divider
          style={{
            backgroundColor: theme.colors.divider,
            marginTop: 20,
            marginBottom: 20,
          }}
        />

        <ListItem
          onPress={() =>
            navigation.navigate(SCREEN_TITLES.SUBSCRIPTION_LIST, {
              isUserSubscription: true,
            })
          }>
          <ListItem.Content>
            <ListItem.Title>나의 구독리스트</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron></ListItem.Chevron>
        </ListItem>

        <ListItem>
          <ListItem.Content>
            <ListItem.Title
              style={{textDecorationLine: 'underline'}}
              onPress={() =>
                navigation.navigate(SCREEN_TITLES.TERMS, {
                  title: '이용약관 동의',
                  content: profile.terms.terms,
                })
              }>
              이용약관 동의
            </ListItem.Title>
          </ListItem.Content>
          <Switch value={profile.agreeTerms} disabled={true} />
        </ListItem>
        <ListItem>
          <ListItem.Content>
            <ListItem.Title
              style={{textDecorationLine: 'underline'}}
              onPress={() =>
                navigation.navigate(SCREEN_TITLES.TERMS, {
                  title: '개인정보 수집 및 이용 동의',
                  content: profile.terms.privacy,
                })
              }>
              개인정보 수집 및 이용 동의
            </ListItem.Title>
          </ListItem.Content>
          <Switch value={profile.agreePrivacy} disabled={true} />
        </ListItem>
        {/* <ListItem>
          <ListItem.Content>
            <ListItem.Title
              style={{textDecorationLine: 'underline'}}
              onPress={() =>
                navigation.navigate(SCREEN_TITLES.TERMS, {
                  title: '위치 정보 수집 및 이용 동의',
                  content: profile.terms.location,
                })
              }>
              위치 정보 수집 및 이용 동의
            </ListItem.Title>
          </ListItem.Content>
          <Switch value={profile.agreeLocation} disabled={true} />
        </ListItem> */}
        <ListItem>
          <ListItem.Content>
            <ListItem.Title
              style={{textDecorationLine: 'underline'}}
              onPress={() =>
                navigation.navigate(SCREEN_TITLES.TERMS, {
                  title: '마케팅 및 광고 수신 동의',
                  content: profile.terms.location,
                })
              }>
              마케팅 및 광고 수신 동의
            </ListItem.Title>
          </ListItem.Content>
          <Switch
            value={profile.agreeMarketing}
            onValueChange={handleMarketingConsentChange}
          />
        </ListItem>
      </View>

      <View style={styles.etcWrap}>
        <Text
          style={{
            marginTop: 10,
            textAlign: 'right',
            textDecorationLine: 'underline',
          }}
          onPress={async () => await useAuthStore.getState().logout()}>
          로그아웃
        </Text>
        {/* <Text
          style={{
            marginTop: 10,
            textAlign: 'right',
            textDecorationLine: 'underline',
          }}
          onPress={() => console.log('비밀번호 변경')}>
          비밀번호 변경
        </Text> */}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  profileContainer: {},
  profileImageWrap: {
    padding: 20,
    alignItems: 'center',
  },
  name: {
    marginTop: 20,
    fontSize: 20,
  },
  profileUserInfoWrap: {
    flexDirection: 'column',
    padding: 10,
  },
  profileInfoListContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  etcWrap: {
    justifyContent: 'flex-end',
    textAlign: 'right',
    marginTop: 20,
    marginRight: 10,
  },
});

export default ProfileScreen;
