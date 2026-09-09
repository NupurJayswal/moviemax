import { useMemo } from "react";
import { Link } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../app/hooks";

import { cancelBooking } from "../features/bookings/bookingSlice";
import { releaseBookedSeats } from "../features/reservations/reservationSlice";

function BookingHistory() {
  const dispatch = useAppDispatch();

  const user = useAppSelector((state) => state.auth.user);

  const bookings = useAppSelector(
    (state) => state.bookings.bookings
  );

  const userBookings = useMemo(() => {
    return bookings
      .filter((booking) => booking.userId === user?.id)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      );
  }, [bookings, user?.id]);

  const handleCancel = (bookingId: string) => {
    const booking = bookings.find(
      (item) => item.id === bookingId
    );

    if (!booking) return;

    if (booking.status !== "CONFIRMED") return;

    const confirmed = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmed) return;

    dispatch(cancelBooking(booking.id));

    dispatch(
      releaseBookedSeats({
        showtimeId: booking.showtimeId,
        seatIds: booking.seats.map((seat) => seat.id),
      })
    );
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white px-4 py-4 shadow-sm md:px-8">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link
            to="/movies"
            className="text-xl font-bold text-blue-600"
          >
            MovieMax
          </Link>

          <Link
            to="/movies"
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            ← Back to Movies
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="text-3xl font-bold">
          My Bookings
        </h1>

        <p className="mt-2 text-slate-500">
          View and manage your movie ticket bookings.
        </p>

        {userBookings.length === 0 ? (
          <div className="mt-8 rounded-2xl bg-white p-10 text-center shadow-sm">
            <h2 className="text-xl font-semibold">
              No bookings yet
            </h2>

            <p className="mt-2 text-slate-500">
              Your confirmed movie bookings will appear here.
            </p>

            <Link
              to="/movies"
              className="mt-6 inline-block rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Browse Movies
            </Link>
          </div>
        ) : (
          <div className="mt-8 space-y-5">
            {userBookings.map((booking) => (
              <div
                key={booking.id}
                className="rounded-2xl bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h2 className="text-xl font-bold">
                      {booking.movieTitle}
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      {booking.showtime.date} •{" "}
                      {booking.showtime.time}
                    </p>
                  </div>

                  <span
                    className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                      booking.status === "CONFIRMED"
                        ? "bg-green-100 text-green-700"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>

                <div className="mt-6 grid gap-5 border-t pt-5 sm:grid-cols-2">
                  <div>
                    <p className="text-sm text-slate-500">
                      Booking ID
                    </p>

                    <p className="mt-1 font-semibold">
                      {booking.id}
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
                          {seat.row}
                          {seat.number}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">
                      Amount Paid
                    </p>

                    <p className="mt-1 text-lg font-bold">
                      ₹{booking.finalAmount}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">
                      Booked On
                    </p>

                    <p className="mt-1 font-medium">
                      {new Date(
                        booking.createdAt
                      ).toLocaleString()}
                    </p>
                  </div>
                </div>

                {booking.status === "CONFIRMED" && (
                  <div className="mt-6 border-t pt-5">
                    <button
                      onClick={() =>
                        handleCancel(booking.id)
                      }
                      className="rounded-lg bg-red-500 px-5 py-3 font-semibold text-white hover:bg-red-600"
                    >
                      Cancel Booking
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default BookingHistory;