import React, {useCallback, useEffect, useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {CheckBox, Button, Text, Input, useTheme} from '@rneui/themed';
import debounce from 'lodash/debounce';
import {SCREEN_TITLES} from '../constants/navigationConstants';
import {SignupScreenProps} from '../types/navigationType';
import {AUTH_PROVIDER} from '../enums/authEnum';
import {
  signupHooks,
  getTermsHooks,
  checkAvailableEmailHooks,
} from '../hooks/authHooks';
import {EMAIL_REGEX, PASSWORD_REGEX} from '../utils/regex';

const SignupScreen: React.FC<SignupScreenProps> = ({navigation, route}) => {
  const {
    provider,
    name: socialName,
    pictureUrl,
    email: socialEmail,
    socialUId,
  } = route.params;
  const {theme} = useTheme();
  const [name, setName] = useState(socialName || '');
  const [email, setEmail] = useState(socialEmail || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [agreePrivacy, setAgreePrivacy] = useState(true);
  const [agreeLocation, setAgreeLocation] = useState(true);
  const [agreeMarketing, setAgreeMarketing] = useState(true);
  const [emailErrMsg, setEmailErrMsg] = useState('');
  const [passwordErrMsg, setPasswordErrMsg] = useState('');
  const [confirmPasswordErrMsg, setConfirmPasswordErrMsg] = useState('');
  const [termsInfo, setTermsInfo] = useState({
    terms: '',
    privacy: '',
    location: '',
    marketing: '',
  });
  const [isAvailableEmail, setAvailableEmail] = useState(false);
  const [availableEmailMsg, setAvailableEmailMsg] = useState('');
  const isComplete =
    name &&
    email &&
    agreeTerms &&
    agreePrivacy &&
    agreeLocation &&
    agreeMarketing &&
    !emailErrMsg.length &&
    (provider === AUTH_PROVIDER.EMAIL
      ? password && !passwordErrMsg.length && !confirmPasswordErrMsg.length
      : true);
  const successEmailMsg = '사용 가능한 이메일입니다.';
  useEffect(() => {
    const fetchTerms = async () => {
      const info = await getTermsHooks();
      info && setTermsInfo(info);
    };

    fetchTerms();
  }, []);
  const checkEmail = useCallback(
    debounce(async (email: string) => {
      const msg = await checkAvailableEmailHooks(email);
      setAvailableEmail(msg === successEmailMsg);
      setAvailableEmailMsg(msg);
    }, 700),
    [],
  );

  const inputFields = [
    {
      key: 'name',
      label: '이름',
      require: true,
      disabled: false,
      value: name,
      onChangeText: (value: string) => setName(value),
    },
    {
      key: 'email',
      label: '이메일',
      require: true,
      disabled: provider !== AUTH_PROVIDER.EMAIL,
      value: email,
      onChangeText: (value: string) => {
        const completeEmail = EMAIL_REGEX.test(value);
        setEmail(value);
        setEmailErrMsg(completeEmail ? '' : '형식이 유효하지 않습니다.');

        if (completeEmail) {
          checkEmail(email);
        } else {
          setAvailableEmail(false);
          setAvailableEmailMsg('');
        }
      },
      errorMessage: availableEmailMsg ? availableEmailMsg : emailErrMsg,
      errorColor: isAvailableEmail ? theme.colors.success : theme.colors.error,
    },
    {
      key: 'password',
      label: '비밀번호',
      require: provider === AUTH_PROVIDER.EMAIL,
      disabled: provider !== AUTH_PROVIDER.EMAIL,
      secureTextEntry: true,
      value: password,
      onChangeText: (value: string) => {
        setPassword(value);
        setPasswordErrMsg(
          PASSWORD_REGEX.test(value)
            ? ''
            : '최소 6자 이상의 소문자, 특수문자, 숫자를 조합해야 됩니다.',
        );
      },
      errorMessage: passwordErrMsg,
    },
    {
      key: 'confirmPassword',
      label: '비밀번호 확인',
      require: provider === AUTH_PROVIDER.EMAIL,
      disabled: provider !== AUTH_PROVIDER.EMAIL,
      secureTextEntry: true,
      value: confirmPassword,
      onChangeText: (value: string) => {
        setConfirmPassword(value);
        setConfirmPasswordErrMsg(
          password === value ? '' : '비밀번호가 일치하지 않습니다.',
        );
      },
      errorMessage: confirmPasswordErrMsg,
    },
  ];
  const agreementFields = [
    {
      key: 'agreeTerms',
      label: '이용약관 동의',
      require: true,
      checked: agreeTerms,
      onPress: () => setAgreeTerms(!agreeTerms),
      content: termsInfo.terms,
    },
    {
      key: 'agreePrivacy',
      label: '개인정보 수집 및 이용 동의',
      require: true,
      checked: agreePrivacy,
      onPress: () => setAgreePrivacy(!agreeTerms),
      content: termsInfo.privacy,
    },
    {
      key: 'agreeMarketing',
      label: '마케팅 및 광고 수신 동의',
      require: false,
      checked: agreeMarketing,
      onPress: () => setAgreeMarketing(!agreeTerms),
      content: termsInfo.marketing,
    },
  ];

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled">
      {/* 회원가입 입력  */}
      {inputFields.map(field => (
        <View
          key={field.key}
          style={!field.require ? {display: 'none'} : undefined}>
          <Text style={styles.label}>
            {field.label}{' '}
            {field.require && <Text style={{color: 'red'}}>*</Text>}
          </Text>
          <View style={styles.inputContainer}>
            <Input
              inputStyle={{color: theme.colors.black}}
              value={field.value}
              onChangeText={value => field.onChangeText(value)}
              autoCapitalize="none"
              disabled={field.disabled}
              errorMessage={field.errorMessage}
              errorStyle={{color: field.errorColor || theme.colors.error}}
              secureTextEntry={field.secureTextEntry}
            />
          </View>
        </View>
      ))}

      {/* 회원가입 동의  */}
      <View style={styles.agreementSection}>
        <View style={styles.checkboxRow}>
          <CheckBox
            checked={
              agreeTerms && agreePrivacy && agreeLocation && agreeMarketing
            }
            onPress={() => {
              setAgreeTerms(!agreeTerms);
              setAgreePrivacy(!agreePrivacy);
              setAgreeLocation(!agreeLocation);
              setAgreeMarketing(!agreeMarketing);
            }}
            containerStyle={styles.checkboxContainer}
          />
          <Text style={styles.sectionTitle}>서비스 약관 동의</Text>
        </View>

        {agreementFields.map(field => (
          <View key={field.key} style={styles.agreementItmesWrap}>
            <CheckBox
              checked={field.checked}
              onPress={() => field.onPress()}
              containerStyle={styles.checkboxContainer}
            />
            <Text
              style={{textDecorationLine: 'underline'}}
              onPress={() =>
                navigation.navigate(SCREEN_TITLES.TERMS, {
                  title: field.label,
                  content: field.content,
                })
              }>{`${field.label} ${field.require ? '(필수)' : '(선택)'}`}</Text>
          </View>
        ))}
      </View>

      <Button
        title="회원가입"
        onPress={async () => {
          await signupHooks({
            provider,
            pictureUrl: pictureUrl || null,
            name,
            email,
            password,
            socialUId,
            agreeTerms,
            agreePrivacy,
            agreeLocation,
            agreeMarketing,
          });
          navigation.navigate(SCREEN_TITLES.SIGNUP_COMPLETE, {provider});
        }}
        buttonStyle={styles.signupButton}
        disabled={!isComplete}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  label: {
    marginBottom: 5,
    fontSize: 16,
    fontWeight: 'bold',
  },
  inputContainer: {
    position: 'relative', // 내부 요소의 절대 위치 조정을 위해 relative 사용
  },
  agreementSection: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkboxContainer: {
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  agreementItmesWrap: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  signupButton: {
    marginTop: 20,
    backgroundColor: '#007AFF',
  },
});

export default SignupScreen;
