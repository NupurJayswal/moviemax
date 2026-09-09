import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../app/hooks";
import { logout } from "../features/auth/authSlice";
import {
  selectMovie,
  selectShowtime,
} from "../features/movies/movieSlice";
import type { Movie } from "../types";
import MovieCard from "../components/MovieCard";

function Movies() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const user = useAppSelector((state) => state.auth.user);
  const movies = useAppSelector((state) => state.movies.movies);
  const selectedMovie = useAppSelector(
    (state) => state.movies.selectedMovie
  );

  const [showMovieModal, setShowMovieModal] =
    useState<Movie | null>(null);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleSelectShow = (movie: Movie) => {
    dispatch(selectMovie(movie.id));
    setShowMovieModal(movie);
  };

  const handleSelectShowtime = (showtimeId: string) => {
    dispatch(selectShowtime(showtimeId));

    if (!selectedMovie) {
      return;
    }

    navigate(
      `/seats/${selectedMovie.id}/${showtimeId}`
    );
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between bg-white px-4 py-4 shadow-sm md:px-8">
        <h1 className="text-2xl font-bold text-blue-600">
          MovieMax
        </h1>

        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-gray-600 sm:block">
            Hi, {user?.name}
          </span>

          <button
            onClick={() => navigate("/bookings")}
            className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            My Bookings
          </button>

          <button
            onClick={handleLogout}
            className="rounded-lg bg-red-500 px-3 py-2 text-sm font-semibold text-white hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Now Showing
          </h2>

          <p className="mt-2 text-gray-500">
            Choose a movie and select your preferred showtime.
          </p>
        </div>

        {/* Movie Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onSelectShow={handleSelectShow}
            />
          ))}
        </div>
      </main>

      {/* Showtime Modal */}
      {showMovieModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold">
                  {showMovieModal.title}
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Select a showtime
                </p>
              </div>

              <button
                onClick={() => setShowMovieModal(null)}
                className="text-xl text-gray-400 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              {showMovieModal.showtimes.map(
                (showtime) => (
                  <button
                    key={showtime.id}
                    onClick={() =>
                      handleSelectShowtime(showtime.id)
                    }
                    className="rounded-lg border border-blue-200 p-3 text-sm font-semibold text-blue-600 hover:bg-blue-50"
                  >
                    {showtime.time}
                  </button>
                )
              )}
            </div>

            <p className="mt-4 text-center text-xs text-gray-400">
              {showMovieModal.showtimes[0]?.date}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Movies;