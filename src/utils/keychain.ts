import * as Keychain from 'react-native-keychain';

export const saveTokens = async (accessToken: string, refreshToken: string) => {
  const tokenData = JSON.stringify({accessToken, refreshToken});
  await Keychain.setGenericPassword('tokens', tokenData);
};

export const getTokens = async () => {
  const credentials = await Keychain.getGenericPassword();

  if (credentials) {
    const {accessToken, refreshToken} = JSON.parse(credentials.password);
    return {accessToken, refreshToken};
  } else {
    return null;
  }
};

export const deleteTokens = async () => {
  await Keychain.resetGenericPassword();
};
