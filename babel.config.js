module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: process.env.BABEL_ENV === 'prod' ? '.env.prod' : '.env.dev',
        safe: false,
        allowUndefined: true,
      },
      'react-native-reanimated/plugin',
    ],
  ],
};
