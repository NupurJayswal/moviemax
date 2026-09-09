import { Link, useLocation, useSearchParams } from "react-router-dom";
import { useAppSelector } from "../app/hooks";

function Failure() {
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const movieId = searchParams.get("movieId");
  const showtimeId = searchParams.get("showtimeId");

  const movie = useAppSelector((state) =>
    state.movies.movies.find((item) => item.id === movieId)
  );

  const showtime = movie?.showtimes.find(
    (show) => show.id === showtimeId
  );

  const user = useAppSelector((state) => state.auth.user);

  const seats = useAppSelector((state) => {
    if (!showtimeId || !user) return [];

    return (
      state.reservations.seatsByShowtime[showtimeId] ?? []
    ).filter(
      (seat) =>
        seat.status === "HELD" &&
        seat.heldBy === user.id
    );
  });

  const attemptedSeats =
    location.state?.selectedSeats ?? seats;

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 shadow">

        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-3xl">
            ✕
          </div>

          <h1 className="text-3xl font-bold text-red-600">
            Payment Failed
          </h1>

          <p className="mt-2 text-slate-500">
            Your payment could not be completed.
          </p>
        </div>

        {movie && showtime && (
          <div className="mt-8 space-y-4">

            <div>
              <p className="text-sm text-slate-500">
                Movie
              </p>
              <p className="font-semibold">
                {movie.title}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Show
              </p>
              <p className="font-semibold">
                {showtime.date} • {showtime.time}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Attempted Seats
              </p>

              <div className="mt-2 flex flex-wrap gap-2">
                {attemptedSeats.map((seat: any) => (
                  <span
                    key={seat.id}
                    className="rounded-md bg-pink-100 px-3 py-1 text-sm font-semibold text-pink-700"
                  >
                    {seat.row}{seat.number}
                  </span>
                ))}
              </div>
            </div>

          </div>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            to={`/payment?movieId=${movieId}&showtimeId=${showtimeId}`}
            className="flex-1 rounded-lg bg-blue-600 px-5 py-3 text-center font-semibold text-white hover:bg-blue-700"
          >
            Retry Payment
          </Link>

          <Link
            to="/movies"
            className="flex-1 rounded-lg border border-slate-300 px-5 py-3 text-center font-semibold hover:bg-slate-50"
          >
            Back to Movies
          </Link>
        </div>

      </div>
    </div>
  );
}

export default Failure;