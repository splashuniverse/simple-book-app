import {View, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {Input, Button, Text, CheckBox, useTheme} from '@rneui/themed';
import {SCREEN_TITLES} from '../constants/navigationConstants';
import {LoginScreenProps} from '../types/navigationType';
import {AUTH_PROVIDER} from '../enums/authEnum';
import {useAuthStore} from '../store/AuthStore';

export default function LoginScreen({navigation}: LoginScreenProps) {
  const {theme} = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAutoLogin, setAutoLogin] = useState(true);

  return (
    <View
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <Input
        placeholder="이메일"
        leftIcon={{type: 'ant-design', name: 'mail', size: 20}}
        inputStyle={{color: theme.colors.primary}}
        value={email}
        onChangeText={value => setEmail(value)}
        autoCapitalize="none"
      />

      <Input
        placeholder="비밀번호"
        secureTextEntry={true}
        leftIcon={{type: 'ant-design', name: 'lock1', size: 20}}
        inputStyle={{color: 'black'}}
        value={password}
        onChangeText={value => setPassword(value)}
        autoCapitalize="none"
      />

      <View style={styles.autoLoginContainer}>
        <CheckBox
          title="자동 로그인"
          checked={isAutoLogin}
          onPress={() => setAutoLogin(!isAutoLogin)}
        />
      </View>

      <Button
        title="로그인"
        onPress={async () =>
          await useAuthStore.getState().login({
            provider: AUTH_PROVIDER.EMAIL,
            email,
            password,
            isAutoLogin,
          })
        }
        buttonStyle={styles.loginButton}
        titleStyle={{textAlign: 'center'}}
        disabledTitleStyle={{textAlign: 'center'}}
      />

      <View style={styles.helpArea}>
        {/* <Text
          onPress={() => navigation.navigate(SCREEN_TITLES.FIND_ACCOUNT)}
          style={styles.helpAreaText}>
          계정 찾기
        </Text>
        <Text
          onPress={() => navigation.navigate(SCREEN_TITLES.FIND_PASSWORD)}
          style={styles.helpAreaText}>
          비밀번호 찾기
        </Text> */}
        <Text
          onPress={() =>
            navigation.navigate(SCREEN_TITLES.SIGNUP, {
              provider: AUTH_PROVIDER.EMAIL,
            })
          }
          style={styles.helpAreaText}>
          회원가입
        </Text>
      </View>

      <View style={styles.socialLoginWrap}>
        <TouchableOpacity
          style={styles.button}
          onPress={async () =>
            await useAuthStore.getState().login({
              provider: AUTH_PROVIDER.GOOGLE,
              navigation,
              isAutoLogin,
            })
          }>
          <Text style={styles.buttonText}>Google로 로그인</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loginButton: {
    marginTop: 10,
    borderRadius: 20,
    padding: 10,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  socialLoginWrap: {
    marginTop: 10,
  },
  helpArea: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  helpAreaText: {
    marginHorizontal: 5,
    textAlign: 'center',
    flexShrink: 1,
  },
  divider: {
    marginTop: 20,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginVertical: 10,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  buttonText: {
    color: '#333',
    fontSize: 16,
  },
  autoLoginContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
    marginVertical: 10,
    fontSize: 10,
  },
});
