import React, {useEffect} from 'react';
import {Linking, useColorScheme} from 'react-native';
import {
  NavigationContainer,
  DefaultTheme,
  createNavigationContainerRef,
} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import ReservationListScreen from '../screens/ReservationListScreen';
import ProfileScreen from '../screens/ProfileScreen';
import {
  BOTTOM_TABS_TITLES,
  SCREEN_TITLES,
} from '../constants/navigationConstants';
import {useTheme} from '@rneui/themed';
import TermsDetailScreen from '../screens/TermsDetailScreen';
import SubscriptionListScreen from '../screens/SubscriptionListScreen';
import SubscriptionDetailScreen from '../screens/SubscriptionDetailScreen';
import NotificationListScreen from '../screens/NotificationListScreen';
import {useReservationStore} from '../store/ReservationStore';
import ReviewWriteScreen from '../screens/ReviewWriteScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const headerHideOption = {headerShown: false};
const commonHeaderOption = {headerBackTitle: ''};

export const navigationRef = createNavigationContainerRef();

function AppTab(): React.JSX.Element {
  const {theme} = useTheme();
  const isDarkMode = useColorScheme() === 'dark';
  const {revervationsCount} = useReservationStore();

  return (
    <Tab.Navigator
      initialRouteName={BOTTOM_TABS_TITLES.RESERVATION}
      screenOptions={{
        ...headerHideOption,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: isDarkMode ? '#888' : '#999',
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderColor: 'black',
          height: 50,
          paddingBottom: 5,
          paddingTop: 5,
        },
      }}>
      <Tab.Screen
        name={BOTTOM_TABS_TITLES.RESERVATION}
        component={ReservationListScreen as React.ComponentType<any>}
        options={{
          title: '',
          tabBarIcon: ({focused}) => {
            return focused ? (
              <FontAwesomeIcon name="bookmark" size={25} />
            ) : (
              <FontAwesomeIcon name="bookmark-o" size={25} />
            );
          },
          tabBarBadge: revervationsCount || 0,
        }}
      />
      <Tab.Screen
        name={BOTTOM_TABS_TITLES.SUBSCRIPTION}
        component={SubscriptionListScreen as React.ComponentType<any>}
        options={{
          title: '',
          tabBarIcon: () => <FontAwesomeIcon name="list" size={25} />,
        }}
      />
      <Tab.Screen
        name={BOTTOM_TABS_TITLES.NOTIFICATION}
        component={NotificationListScreen as React.ComponentType<any>}
        options={{
          title: '',
          tabBarIcon: ({focused}) => {
            return focused ? (
              <FontAwesomeIcon name="bell" size={25} />
            ) : (
              <FontAwesomeIcon name="bell-o" size={25} />
            );
          },
        }}
      />
      <Tab.Screen
        name={BOTTOM_TABS_TITLES.PROFILE}
        component={ProfileScreen as React.ComponentType<any>}
        options={{
          title: '',
          tabBarIcon: ({focused}) => {
            return focused ? (
              <FontAwesomeIcon name="user" size={25} />
            ) : (
              <FontAwesomeIcon name="user-o" size={25} />
            );
          },
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator(): React.JSX.Element {
  const {theme} = useTheme();

  useEffect(() => {
    const handleDeepLink = ({url}: {url: string}) => {
      console.log('Deep link URL: ', url);
      if (url === 'sungjufirstapp://profile') {
        // Use ref to navigate to the Profile tab
        if (navigationRef.isReady()) {
          navigationRef.navigate(BOTTOM_TABS_TITLES.PROFILE);
        }
      }
    };

    const subscription = Linking.addEventListener('url', handleDeepLink);

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <NavigationContainer
      ref={navigationRef}
      linking={{
        prefixes: ['sungjufirstapp://'], // 딥링크 URI 스킴 정의
      }}
      theme={{
        dark: theme.mode === 'dark',
        colors: {
          ...DefaultTheme.colors,
          primary: theme.colors.primary,
          background: theme.colors.background,
        },
        fonts: DefaultTheme.fonts,
      }}>
      <Stack.Navigator>
        <Stack.Screen
          name="AppTab"
          component={AppTab}
          options={headerHideOption}
        />
        <Stack.Screen
          name={SCREEN_TITLES.SUBSCRIPTION_LIST}
          component={SubscriptionListScreen as React.ComponentType<any>}
          options={commonHeaderOption}
        />
        <Stack.Screen
          name={SCREEN_TITLES.SUBSCRIPTION_DETAIL}
          component={SubscriptionDetailScreen as React.ComponentType<any>}
          options={commonHeaderOption}
        />
        <Stack.Screen
          name={SCREEN_TITLES.TERMS}
          component={TermsDetailScreen as React.ComponentType<any>}
          options={commonHeaderOption}
        />
        <Stack.Screen
          name={SCREEN_TITLES.PROFILE}
          component={ProfileScreen as React.ComponentType<any>}
          options={commonHeaderOption}
        />
        <Stack.Screen
          name={SCREEN_TITLES.REVIEW_WRITE}
          component={ReviewWriteScreen as React.ComponentType<any>}
          options={commonHeaderOption}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
