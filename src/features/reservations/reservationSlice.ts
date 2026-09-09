import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import seatsData from "../../data/seats.json";
import type { Seat, SeatCategory } from "../../types";
import { storage } from "../../utils/storage";

const HOLD_DURATION = 3 * 60 * 1000;

interface ReservationState {
  seatsByShowtime: Record<string, Seat[]>;
}

const initialState: ReservationState = {
  seatsByShowtime: storage.getSeats(),
};

const getInitialSeats = (): Seat[] => {
  return seatsData.map((seat) => ({
    ...seat,
    category: seat.category as SeatCategory,
    status: "AVAILABLE",
    holdExpiresAt: null,
    heldBy: null,
  }));
};

const reservationSlice = createSlice({
  name: "reservations",

  initialState,

  reducers: {
    initializeShowtime: (state, action: PayloadAction<string>) => {
      const showtimeId = action.payload;

      if (!state.seatsByShowtime[showtimeId]) {
        state.seatsByShowtime[showtimeId] = getInitialSeats();

        storage.setSeats(state.seatsByShowtime);
      }
    },

    holdSeat: (
      state,
      action: PayloadAction<{
        showtimeId: string;
        seatId: string;
        userId: string;
      }>,
    ) => {
      const { showtimeId, seatId, userId } = action.payload;

      const seats = state.seatsByShowtime[showtimeId];

      if (!seats) {
        return;
      }

      const seat = seats.find((item) => item.id === seatId);

      if (!seat) {
        return;
      }

      if (seat.status !== "AVAILABLE") {
        return;
      }

      seat.status = "HELD";
      seat.heldBy = userId;
      seat.holdExpiresAt = Date.now() + HOLD_DURATION;

      storage.setSeats(state.seatsByShowtime);
    },

    releaseSeat: (
      state,
      action: PayloadAction<{
        showtimeId: string;
        seatId: string;
        userId: string;
      }>,
    ) => {
      const { showtimeId, seatId, userId } = action.payload;

      const seats = state.seatsByShowtime[showtimeId];

      if (!seats) {
        return;
      }

      const seat = seats.find((item) => item.id === seatId);

      if (!seat) {
        return;
      }

      if (seat.status !== "HELD" || seat.heldBy !== userId) {
        return;
      }

      seat.status = "AVAILABLE";
      seat.holdExpiresAt = null;
      seat.heldBy = null;

      storage.setSeats(state.seatsByShowtime);
    },

    releaseExpiredSeats: (state, action: PayloadAction<string>) => {
      const showtimeId = action.payload;

      const seats = state.seatsByShowtime[showtimeId];

      if (!seats) {
        return;
      }

      const now = Date.now();

      seats.forEach((seat) => {
        if (
          seat.status === "HELD" &&
          seat.holdExpiresAt !== null &&
          seat.holdExpiresAt <= now
        ) {
          seat.status = "AVAILABLE";
          seat.holdExpiresAt = null;
          seat.heldBy = null;
        }
      });

      storage.setSeats(state.seatsByShowtime);
    },

    bookSeats: (
      state,
      action: PayloadAction<{
        showtimeId: string;
        seatIds: string[];
        userId: string;
      }>,
    ) => {
      const { showtimeId, seatIds, userId } = action.payload;

      const seats = state.seatsByShowtime[showtimeId];

      if (!seats) {
        return;
      }

      seats.forEach((seat) => {
        if (
          seatIds.includes(seat.id) &&
          seat.status === "HELD" &&
          seat.heldBy === userId
        ) {
          seat.status = "BOOKED";
          seat.holdExpiresAt = null;
          seat.heldBy = null;
        }
      });

      storage.setSeats(state.seatsByShowtime);
    },
    releaseBookedSeats: (
  state,
  action: PayloadAction<{
    showtimeId: string;
    seatIds: string[];
  }>
) => {
  const { showtimeId, seatIds } = action.payload;

  const seats = state.seatsByShowtime[showtimeId];

  if (!seats) return;

  seats.forEach((seat) => {
    if (
      seatIds.includes(seat.id) &&
      seat.status === "BOOKED"
    ) {
      seat.status = "AVAILABLE";
      seat.holdExpiresAt = null;
      seat.heldBy = null;
    }
  });

  storage.setSeats(state.seatsByShowtime);
},
  },
});

export const {
  initializeShowtime,
  holdSeat,
  releaseSeat,
  releaseExpiredSeats,
  bookSeats,
  releaseBookedSeats
} = reservationSlice.actions;

export default reservationSlice.reducer;
