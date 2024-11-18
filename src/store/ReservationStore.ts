import {create} from 'zustand';
import {
  cancelReservationV1,
  getReservationDetailV1,
  getReservationListV1,
  requestReservationV1,
} from '../services/reservationService';

interface ReservationState {
  reservations: any[];
  markedDates: string[];
  revervationsCount: number;
  reservationDetail: any;

  fetchReservations: (date?: string) => Promise<void>;
  fetchReservationDetail: (reservationId: number) => Promise<void>;
  requestReservation: (
    placeId: number,
    reservationId?: number,
  ) => Promise<void>;
  cancelReservation: (reservationId: number, placeId?: number) => Promise<void>;
  resetReservation: () => void;
}

export const useReservationStore = create<ReservationState>((set, get) => ({
  reservations: [],
  markedDates: [],
  revervationsCount: 0,
  reservationDetail: {},

  fetchReservations: async (date?: string) => {
    try {
      const data = await getReservationListV1(date);

      set({
        reservations: data.reservations,
        revervationsCount: data.reservations.length,
        markedDates: data.markedDates,
      });
    } catch (error) {
      console.error(error);
    }
  },

  fetchReservationDetail: async (reservationId: number) => {
    try {
      const res = await getReservationDetailV1(reservationId);

      set({
        reservationDetail: res.data.reservationDetail,
      });
    } catch (error) {
      console.error(error);
    }
  },

  requestReservation: async (placeId: number, reservationId?: number) => {
    try {
      await requestReservationV1(placeId);
    } catch (error) {
      console.error(error);
    }
  },

  cancelReservation: async (reservationId: number, placeId?: number) => {
    try {
      await cancelReservationV1(reservationId);
    } catch (error) {
      console.error(error);
    }
  },

  resetReservation: () => {
    set({
      reservations: [],
      markedDates: [],
      revervationsCount: 0,
      reservationDetail: {},
    });
  },
}));
