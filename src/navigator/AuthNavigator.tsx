import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {SCREEN_TITLES} from '../constants/navigationConstants';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import SignupCompleteScreen from '../screens/SignupCompleteScreen';
import FindAccountScreen from '../screens/FindAccountScreen';
import FindPasswordScreen from '../screens/FindPasswordScreen';
import TermsDetailScreen from '../screens/TermsDetailScreen';

const Stack = createStackNavigator();
const headerHideOption = {headerShown: false};
const commonHeaderOption = {headerBackTitle: ''};

export default function LoginNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={SCREEN_TITLES.LOGIN}>
        <Stack.Screen
          name={SCREEN_TITLES.LOGIN}
          component={LoginScreen as React.ComponentType<any>}
          options={headerHideOption}
        />
        <Stack.Screen
          name={SCREEN_TITLES.SIGNUP}
          component={SignupScreen as React.ComponentType<any>}
          options={commonHeaderOption}
        />
        <Stack.Screen
          name={SCREEN_TITLES.SIGNUP_COMPLETE}
          component={SignupCompleteScreen as React.ComponentType<any>}
          options={headerHideOption}
        />
        <Stack.Screen
          name={SCREEN_TITLES.TERMS}
          component={TermsDetailScreen as React.ComponentType<any>}
          options={commonHeaderOption}
        />
        {/* <Stack.Screen
          name={SCREEN_TITLES.FIND_ACCOUNT}
          component={FindAccountScreen as React.ComponentType<any>}

        />
        <Stack.Screen
          name={SCREEN_TITLES.FIND_PASSWORD}
          component={FindPasswordScreen as React.ComponentType<any>}
        /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
