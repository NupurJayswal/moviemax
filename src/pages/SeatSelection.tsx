import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../app/hooks";

import {
  holdSeat,
  initializeShowtime,
  releaseExpiredSeats,
  releaseSeat,
} from "../features/reservations/reservationSlice";

import Seat from "../components/Seat";

function SeatSelection() {
  const { movieId, showtimeId } = useParams<{
    movieId: string;
    showtimeId: string;
  }>();

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const user = useAppSelector(
    (state) => state.auth.user
  );

  const movie = useAppSelector((state) =>
    state.movies.movies.find(
      (item) => item.id === movieId
    )
  );

  const showtime = movie?.showtimes.find(
    (show) => show.id === showtimeId
  );

  const seats =
    useAppSelector(
      (state) =>
        state.reservations.seatsByShowtime[
          showtimeId ?? ""
        ]
    ) ?? [];

  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (showtimeId) {
      dispatch(initializeShowtime(showtimeId));
    }
  }, [dispatch, showtimeId]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (!showtimeId) {
      return;
    }

    dispatch(releaseExpiredSeats(showtimeId));
  }, [dispatch, showtimeId, now]);

  const selectedSeats = useMemo(() => {
    return seats.filter(
      (seat) =>
        seat.status === "HELD" &&
        seat.heldBy === user?.id &&
        seat.holdExpiresAt !== null &&
        seat.holdExpiresAt > now
    );
  }, [seats, user?.id, now]);

  const subtotal = selectedSeats.reduce(
    (total, seat) => total + seat.price,
    0
  );

  const getRemainingSeconds = (
    holdExpiresAt: number | null
  ) => {
    if (!holdExpiresAt) {
      return null;
    }

    const difference = Math.max(
      0,
      holdExpiresAt - now
    );

    return Math.ceil(difference / 1000);
  };

  const handleSeatClick = (
    seatId: string
  ) => {
    if (!showtimeId || !user) {
      return;
    }

    const seat = seats.find(
      (item) => item.id === seatId
    );

    if (!seat) {
      return;
    }

    if (seat.status === "AVAILABLE") {
      dispatch(
        holdSeat({
          showtimeId,
          seatId,
          userId: user.id,
        })
      );

      return;
    }

    if (
      seat.status === "HELD" &&
      seat.heldBy === user.id
    ) {
      dispatch(
        releaseSeat({
          showtimeId,
          seatId,
          userId: user.id,
        })
      );
    }
  };

  const handleContinue = () => {
    if (selectedSeats.length === 0) {
      return;
    }

    navigate(
      `/payment?movieId=${movieId}&showtimeId=${showtimeId}`
    );
  };

  if (!movie || !showtime) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Showtime not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white px-4 py-4 shadow-sm md:px-8">
        <div className="mx-auto max-w-7xl">
          <button
            onClick={() => navigate("/movies")}
            className="text-sm font-medium text-blue-600"
          >
            ← Back to Movies
          </button>

          <h1 className="mt-3 text-2xl font-bold">
            {movie.title}
          </h1>

          <p className="text-sm text-gray-500">
            {showtime.date} • {showtime.time}
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_350px]">
          <section className="rounded-2xl bg-white p-5 shadow-sm md:p-8">
            <h2 className="text-xl font-bold">
              Select Your Seats
            </h2>

            <div className="mx-auto mt-8 max-w-xl">
              <div className="rounded-t-[50%] border-t-8 border-blue-400 pb-3 text-center text-xs text-gray-400">
                SCREEN
              </div>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-5 text-sm">
              <div className="flex items-center gap-2">
                <span className="h-4 w-4 rounded bg-blue-100 border" />
                Available
              </div>

              <div className="flex items-center gap-2">
                <span className="h-4 w-4 rounded bg-pink-500" />
                Your Hold
              </div>

              <div className="flex items-center gap-2">
                <span className="h-4 w-4 rounded bg-slate-500" />
                Booked
              </div>
            </div>

            <div className="mt-10 overflow-x-auto pb-8">
              <div className="mx-auto w-fit space-y-8">
                {["A", "B", "C", "D", "E"].map(
                  (row) => {
                    const rowSeats = seats.filter(
                      (seat) => seat.row === row
                    );

                    return (
                      <div
                        key={row}
                        className="flex items-center gap-3"
                      >
                        <span className="w-6 text-sm font-bold text-gray-500">
                          {row}
                        </span>

                        <div className="grid grid-cols-8 gap-2 sm:gap-3">
                          {rowSeats.map((seat) => {
                            const isCurrentUser =
                              seat.heldBy === user?.id;

                            return (
                              <Seat
                                key={seat.id}
                                seat={seat}
                                isCurrentUser={
                                  isCurrentUser
                                }
                                remainingSeconds={getRemainingSeconds(
                                  seat.holdExpiresAt
                                )}
                                onClick={() =>
                                  handleSeatClick(
                                    seat.id
                                  )
                                }
                              />
                            );
                          })}
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg bg-gray-50 p-3 text-center">
                <p className="text-sm font-semibold">
                  Silver
                </p>
                <p className="text-gray-500">
                  ₹150
                </p>
              </div>

              <div className="rounded-lg bg-gray-50 p-3 text-center">
                <p className="text-sm font-semibold">
                  Gold
                </p>
                <p className="text-gray-500">
                  ₹220
                </p>
              </div>

              <div className="rounded-lg bg-gray-50 p-3 text-center">
                <p className="text-sm font-semibold">
                  Premium
                </p>
                <p className="text-gray-500">
                  ₹300
                </p>
              </div>
            </div>
          </section>

          <aside className="h-fit rounded-2xl bg-white p-6 shadow-sm lg:sticky lg:top-24">
            <h2 className="text-xl font-bold">
              Booking Summary
            </h2>

            <div className="mt-5 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">
                  Movie
                </span>

                <span className="font-medium">
                  {movie.title}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-500">
                  Showtime
                </span>

                <span className="font-medium">
                  {showtime.time}
                </span>
              </div>

              <div className="border-t pt-3">
                <p className="text-sm font-semibold">
                  Selected Seats
                </p>

                {selectedSeats.length === 0 ? (
                  <p className="mt-2 text-sm text-gray-400">
                    No seats selected
                  </p>
                ) : (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedSeats.map(
                      (seat) => (
                        <span
                          key={seat.id}
                          className="rounded-md bg-pink-100 px-2 py-1 text-xs font-semibold text-pink-700"
                        >
                          {seat.id}
                        </span>
                      )
                    )}
                  </div>
                )}
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>

                  <span className="font-bold">
                    ₹{subtotal}
                  </span>
                </div>
              </div>

              <button
                disabled={selectedSeats.length === 0}
                onClick={handleContinue}
                className="mt-4 w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                Continue to Payment
              </button>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default SeatSelection;