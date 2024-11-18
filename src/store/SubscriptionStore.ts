import {create} from 'zustand';
import {
  getSubscriptionDetailV1,
  getSubscriptionListV1,
  subsribeV1,
  unsubsribeV1,
} from '../services/subscriptionService';

interface SubscriptionState {
  subscriptions: any[]; // 구독 리스트
  subscriptionDetail: any;

  fetchSubscriptions: (
    isUserSubscription: boolean | undefined,
  ) => Promise<void>;
  fetchSubscriptionDetail: (partnerId: number) => Promise<void>;
  subscribe: (partnerIds: number[]) => Promise<void>;
  unsubscribe: (partnerIds: number[]) => Promise<void>;
  resetSubscriptions: () => void;
  resetSubscriptionDetail: () => void;
}

export const useSubscriptionStore = create<SubscriptionState>((set, get) => ({
  subscriptions: [],
  subscriptionDetail: {},

  fetchSubscriptions: async (isUserSubscription: boolean | undefined) => {
    try {
      const response = await getSubscriptionListV1(isUserSubscription);

      set({
        subscriptions: response.data.subscriptions,
      });
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    }
  },

  fetchSubscriptionDetail: async (partnerId: number) => {
    try {
      const res = await getSubscriptionDetailV1(partnerId);

      set({
        subscriptionDetail: res.data.detail,
      });
    } catch (error) {
      console.error('Error fetching subscription detail:', error);
    }
  },

  subscribe: async (partnerIds: number[]) => {
    try {
      await subsribeV1(partnerIds);
      const subscriptions = get().subscriptions.map(item => ({
        ...item,
        isSubscribed: partnerIds[0] === item.id ? true : item.isSubscribed,
      }));

      set({
        subscriptions,
      });
    } catch (error) {
      console.error('구독실패:', error);
    }
  },

  unsubscribe: async (partnerIds: number[]) => {
    try {
      await unsubsribeV1(partnerIds);
      const subscriptions = get().subscriptions.map(item => ({
        ...item,
        isSubscribed: partnerIds[0] === item.id ? false : item.isSubscribed,
      }));

      set({
        subscriptions,
      });
    } catch (error) {
      console.error('구독실패:', error);
    }
  },

  resetSubscriptions: () => {
    set({
      subscriptions: [],
    });
  },

  resetSubscriptionDetail: () => {
    set({
      subscriptionDetail: {},
    });
  },
}));
