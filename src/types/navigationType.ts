import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {
  BOTTOM_TABS_TITLES,
  SCREEN_TITLES,
} from '../constants/navigationConstants';
import {AUTH_PROVIDER} from '../enums/authEnum';

export type TabParamList = {
  [BOTTOM_TABS_TITLES.PROFILE]: undefined;
};

export type StackParamList = {
  [SCREEN_TITLES.LOGIN]: undefined;
  [SCREEN_TITLES.FIND_ACCOUNT]: undefined;
  [SCREEN_TITLES.FIND_PASSWORD]: undefined;
  [SCREEN_TITLES.TERMS]: {
    title: string;
    content: string;
  };
  [SCREEN_TITLES.SIGNUP]: {
    provider: AUTH_PROVIDER;
    name?: string;
    email?: string;
    pictureUrl?: string;
    socialUId?: string;
  };
  [SCREEN_TITLES.SIGNUP_COMPLETE]: {
    provider: AUTH_PROVIDER;
  };
  [SCREEN_TITLES.PROFILE]: undefined;
  [SCREEN_TITLES.SUBSCRIPTION_LIST]: {
    isUserSubscription?: boolean;
  };
  [SCREEN_TITLES.SUBSCRIPTION_DETAIL]: {
    partnerId: number;
  };
  [SCREEN_TITLES.RESERVATION_LIST]: undefined;
  [SCREEN_TITLES.REVIEW_WRITE]: {
    placeId: number;
  };
};

//terms
export type TermsScreenNavigationProp = StackNavigationProp<
  StackParamList,
  typeof SCREEN_TITLES.TERMS
>;
export type TermsScreenRouteProp = RouteProp<
  StackParamList,
  typeof SCREEN_TITLES.TERMS
>;
export type TermsScreenProps = {
  navigation: TermsScreenNavigationProp;
  route: TermsScreenRouteProp;
};

// login
export type LoginScreenNavigationProp = StackNavigationProp<StackParamList>;
export type LoginScreenRouteProp = RouteProp<StackParamList>;
export type LoginScreenProps = {
  navigation: LoginScreenNavigationProp;
  route: LoginScreenRouteProp;
};

// signup
export type SignupScreenNavigationProp = StackNavigationProp<
  StackParamList,
  typeof SCREEN_TITLES.SIGNUP
>;
export type SignupScreenRouteProp = RouteProp<
  StackParamList,
  typeof SCREEN_TITLES.SIGNUP
>;
export type SignupScreenProps = {
  navigation: SignupScreenNavigationProp;
  route: SignupScreenRouteProp;
};

// singup complete
export type SignupCompleteScreenNavigationProp = StackNavigationProp<
  StackParamList,
  typeof SCREEN_TITLES.SIGNUP_COMPLETE
>;
export type SignupCompleteScreenRouteProp = RouteProp<
  StackParamList,
  typeof SCREEN_TITLES.SIGNUP_COMPLETE
>;
export type SignupCompleteScreenProps = {
  navigation: SignupCompleteScreenNavigationProp;
  route: SignupCompleteScreenRouteProp;
};

// profile
export type ProfileScreenNavigationProp = StackNavigationProp<
  StackParamList,
  typeof SCREEN_TITLES.PROFILE
>;

export type ProfileScreenRouteProp = RouteProp<
  StackParamList,
  typeof SCREEN_TITLES.PROFILE
>;

export type ProfileScreenProps = {
  navigation: ProfileScreenNavigationProp;
  route: ProfileScreenRouteProp;
};

// reservation
export type ReservationListScreenNavigationProp = StackNavigationProp<
  StackParamList,
  typeof SCREEN_TITLES.RESERVATION_LIST
>;

export type ReservationListScreenRouteProp = RouteProp<
  StackParamList,
  typeof SCREEN_TITLES.SUBSCRIPTION_LIST
>;

export type ReservationListScreenProp = {
  navigation: ReservationListScreenNavigationProp;
  route: ReservationListScreenRouteProp;
};

// subscription
export type SubscriptionListScreenNavigationProp = StackNavigationProp<
  StackParamList,
  typeof SCREEN_TITLES.SUBSCRIPTION_LIST
>;

export type SubscriptionListScreenRouteProp = RouteProp<
  StackParamList,
  typeof SCREEN_TITLES.SUBSCRIPTION_LIST
>;

export type SubscriptionListScreenProp = {
  navigation: SubscriptionListScreenNavigationProp;
  route: SubscriptionListScreenRouteProp;
};

export type SubscriptionDetailScreenNavigationProp = StackNavigationProp<
  StackParamList,
  typeof SCREEN_TITLES.SUBSCRIPTION_DETAIL
>;

export type SubscriptionDetailScreenRouteProp = RouteProp<
  StackParamList,
  typeof SCREEN_TITLES.SUBSCRIPTION_DETAIL
>;

export type SubscriptionDetailScreenProp = {
  navigation: SubscriptionDetailScreenNavigationProp;
  route: SubscriptionDetailScreenRouteProp;
};
