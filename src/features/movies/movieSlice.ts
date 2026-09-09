import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import moviesData from "../../data/movies.json";
import type { Movie, Showtime } from "../../types";

interface MovieState {
  movies: Movie[];
  selectedMovie: Movie | null;
  selectedShowtime: Showtime | null;
}

const initialState: MovieState = {
  movies: moviesData,
  selectedMovie: null,
  selectedShowtime: null,
};

const movieSlice = createSlice({
  name: "movies",
  initialState,
  reducers: {
    selectMovie: (state, action: PayloadAction<string>) => {
      const movie = state.movies.find(
        (movie) => movie.id === action.payload
      );

      state.selectedMovie = movie ?? null;
      state.selectedShowtime = null;
    },

    selectShowtime: (
      state,
      action: PayloadAction<string>
    ) => {
      if (!state.selectedMovie) {
        return;
      }

      const showtime = state.selectedMovie.showtimes.find(
        (show) => show.id === action.payload
      );

      state.selectedShowtime = showtime ?? null;
    },

    clearSelection: (state) => {
      state.selectedMovie = null;
      state.selectedShowtime = null;
    },
  },
});

export const {
  selectMovie,
  selectShowtime,
  clearSelection,
} = movieSlice.actions;

export default movieSlice.reducer;