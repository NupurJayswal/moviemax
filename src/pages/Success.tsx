import { Link, useParams } from "react-router-dom";
import { useAppSelector } from "../app/hooks";

function Success() {
  const { bookingId } = useParams();

  const booking = useAppSelector((state) =>
    state.bookings.bookings.find(
      (item) => item.id === bookingId
    )
  );

  if (!booking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="rounded-xl bg-white p-8 text-center shadow">
          <h1 className="mb-3 text-2xl font-bold">
            Booking not found
          </h1>

          <Link
            to="/movies"
            className="text-blue-600 hover:underline"
          >
            Back to Movies
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 shadow">

        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">
            ✓
          </div>

          <h1 className="text-3xl font-bold text-green-600">
            Booking Confirmed!
          </h1>

          <p className="mt-2 text-slate-500">
            Your movie tickets have been booked successfully.
          </p>
        </div>

        <div className="space-y-4">

          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-sm text-slate-500">
              Booking ID
            </p>
            <p className="font-bold">
              {booking.id}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">
              Movie
            </p>
            <p className="text-lg font-semibold">
              {booking.movieTitle}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">
              Show
            </p>
            <p className="font-medium">
              {booking.showtime.date} • {booking.showtime.time}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">
              Seats
            </p>

            <div className="mt-2 flex flex-wrap gap-2">
              {booking.seats.map((seat) => (
                <span
                  key={seat.id}
                  className="rounded-md bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700"
                >
                  {seat.row}{seat.number}
                </span>
              ))}
            </div>
          </div>

          <div className="border-t pt-4">
            <p className="text-sm text-slate-500">
              Final Amount
            </p>

            <p className="text-2xl font-bold">
              ₹{booking.finalAmount}
            </p>
          </div>

        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            to="/movies"
            className="flex-1 rounded-lg bg-blue-600 px-5 py-3 text-center font-semibold text-white hover:bg-blue-700"
          >
            Browse Movies
          </Link>

          <Link
            to="/bookings"
            className="flex-1 rounded-lg border border-slate-300 px-5 py-3 text-center font-semibold hover:bg-slate-50"
          >
            My Bookings
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Success;