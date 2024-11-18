/**
 * @format
 */

import {AppRegistry, Platform} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';

const originalConsoleLog = console.log;

console.log = (...args) => {
  if (Platform.OS === 'ios') {
    originalConsoleLog('IOS_LOG:', ...args);
  } else if (Platform.OS === 'android') {
    originalConsoleLog('ANDROID_LOG:', ...args);
  } else {
    originalConsoleLog('LOG:', ...args);
  }
};

AppRegistry.registerComponent(appName, () => App);
