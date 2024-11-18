import {create} from 'zustand';

interface LoadingState {
  loadingCount: number;
  isLoading: boolean;
  incrementLoading: () => void;
  decrementLoading: () => void;
  resetLoading: () => void;
}

export const useLoadingStore = create<LoadingState>(set => ({
  loadingCount: 0,
  isLoading: false,

  incrementLoading: () => {
    set(state => {
      const newCount = state.loadingCount + 1;
      return {loadingCount: newCount, isLoading: newCount > 0};
    });
  },

  decrementLoading: () => {
    set(state => {
      const newCount = Math.max(0, state.loadingCount - 1); // 음수 방지
      return {loadingCount: newCount, isLoading: newCount > 0};
    });
  },

  resetLoading: () => set({loadingCount: 0, isLoading: false}),
}));
