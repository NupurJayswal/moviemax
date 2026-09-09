import {
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";

import type { Booking } from "../../types";
import { storage } from "../../utils/storage";

interface BookingState {
  bookings: Booking[];
}

const initialState: BookingState = {
  bookings: storage.getBookings(),
};

const bookingSlice = createSlice({
  name: "bookings",
  initialState,

  reducers: {
    addBooking: (
      state,
      action: PayloadAction<Booking>
    ) => {
      state.bookings.unshift(action.payload);

      storage.setBookings(state.bookings);
    },

    cancelBooking: (
      state,
      action: PayloadAction<string>
    ) => {
      const booking = state.bookings.find(
        (item) => item.id === action.payload
      );

      if (!booking) {
        return;
      }

      booking.status = "CANCELLED";

      storage.setBookings(state.bookings);
    },
  },
});

export const {
  addBooking,
  cancelBooking,
} = bookingSlice.actions;

export default bookingSlice.reducer;