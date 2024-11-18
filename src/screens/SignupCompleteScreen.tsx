import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text, Button, useTheme} from '@rneui/themed';
import {SCREEN_TITLES} from '../constants/navigationConstants';
import {SignupCompleteScreenProps} from '../types/navigationType';
import {AUTH_PROVIDER} from '../enums/authEnum';

const SignupCompleteScreen: React.FC<SignupCompleteScreenProps> = ({
  navigation,
  route,
}) => {
  const {provider} = route.params;
  const {theme} = useTheme();

  const messageMap = {
    [AUTH_PROVIDER.EMAIL]: {
      title: '이메일 인증을 완료해주세요!',
      buttonTitle: '로그인 하러가기',
    },
    [AUTH_PROVIDER.GOOGLE]: {
      title: '회원가입이 완료되었습니다!',
      buttonTitle: '홈으로 가기',
    },
  };
  const message = messageMap[provider] || {
    title: '회원가입이 완료되었습니다!',
    buttonTitle: '홈으로 가기',
  };

  return (
    <View
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <Text style={[styles.text, {color: theme.colors.primary}]}>
        {message.title}
      </Text>
      <Button
        title={message.buttonTitle}
        onPress={() => navigation.navigate(SCREEN_TITLES.LOGIN)}
        buttonStyle={styles.homeButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  text: {
    marginBottom: 20,
    fontSize: 25,
    textAlign: 'center',
  },
  homeButton: {
    backgroundColor: '#007AFF',
  },
});

export default SignupCompleteScreen;
