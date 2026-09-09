import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import movieReducer from "../features/movies/movieSlice";
import reservationReducer from "../features/reservations/reservationSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    movies: movieReducer,
    reservations: reservationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;