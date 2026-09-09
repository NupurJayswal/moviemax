import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../app/hooks";

import { calculateCoupon } from "../utils/price";
import { bookSeats } from "../features/reservations/reservationSlice";
import { addBooking } from "../features/bookings/bookingSlice";
import type { Booking } from "../types";

function Payment() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [cardholderName, setCardholderName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [errors, setErrors] = useState({
    cardholderName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const [searchParams] = useSearchParams();

  const movieId = searchParams.get("movieId");
  const showtimeId = searchParams.get("showtimeId");

  const user = useAppSelector((state) => state.auth.user);

  const movie = useAppSelector((state) =>
    state.movies.movies.find((item) => item.id === movieId),
  );

  const showtime = movie?.showtimes.find((show) => show.id === showtimeId);

  const seats =
    useAppSelector(
      (state) => state.reservations.seatsByShowtime[showtimeId ?? ""],
    ) ?? [];

  const selectedSeats = useMemo(() => {
    return seats.filter(
      (seat) => seat.status === "HELD" && seat.heldBy === user?.id,
    );
  }, [seats, user?.id]);

  const subtotal = selectedSeats.reduce((total, seat) => total + seat.price, 0);

  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");

  const [couponSuccess, setCouponSuccess] = useState("");

  const [discount, setDiscount] = useState(0);

  const finalAmount = Math.max(0, subtotal - discount);

  const handleApplyCoupon = () => {
    const result = calculateCoupon(couponCode, subtotal, selectedSeats.length);

    if (!result.valid) {
      setDiscount(0);
      setCouponError(result.message);
      setCouponSuccess("");
      return;
    }

    setDiscount(result.discount);
    setCouponError("");
    setCouponSuccess(result.message);
  };

  const handlePaymentSuccess = () => {
    const newErrors = {
      cardholderName: "",
      cardNumber: "",
      expiry: "",
      cvv: "",
    };

    if (!cardholderName.trim()) {
      newErrors.cardholderName = "Cardholder name is required.";
    }

    if (!cardNumber.trim()) {
      newErrors.cardNumber = "Card number is required.";
    }

    if (!expiry.trim()) {
      newErrors.expiry = "Expiry date is required.";
    }

    if (!cvv.trim()) {
      newErrors.cvv = "CVV is required.";
    }

    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error !== "")) {
      return;
    }

    if (!user || !movie || !showtime || !showtimeId) {
      return;
    }

    const activeSeats = selectedSeats.filter(
      (seat) => seat.holdExpiresAt !== null && seat.holdExpiresAt > Date.now(),
    );

    if (activeSeats.length === 0) {
      setCouponError(
        "Your seat hold has expired. Please select your seats again.",
      );

      return;
    }

    const bookingId = `BOOK-${Date.now()}`;

    const booking: Booking = {
      id: bookingId,

      userId: user.id,

      movieId: movie.id,

      movieTitle: movie.title,

      showtimeId: showtime.id,

      showtime,

      seats: activeSeats.map((seat) => ({
        id: seat.id,
        row: seat.row,
        number: seat.number,
        category: seat.category,
        price: seat.price,
      })),

      subtotal,

      discount,

      finalAmount,

      status: "CONFIRMED",

      createdAt: new Date().toISOString(),
    };

    dispatch(
      bookSeats({
        showtimeId,
        seatIds: activeSeats.map((seat) => seat.id),
        userId: user.id,
      }),
    );

    dispatch(addBooking(booking));

    navigate(`/success/${bookingId}`);
  };

  const handlePaymentFailure = () => {
    const params = new URLSearchParams({
      movieId: movieId ?? "",
      showtimeId: showtimeId ?? "",
      coupon: couponCode,
      discount: String(discount),
      amount: String(finalAmount),
    });

    navigate(`/failure?${params.toString()}`, {
      state: {
        selectedSeats,
      },
    });
  };

  if (!movie || !showtime || selectedSeats.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold">No active reservation found</h1>

          <p className="mt-2 text-gray-500">Please select your seats again.</p>

          <button
            onClick={() => navigate(`/seats/${movieId}/${showtimeId}`)}
            className="mt-5 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Select Seats
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white px-4 py-4 shadow-sm md:px-8">
        <div className="mx-auto max-w-5xl">
          <button
            onClick={() => navigate(`/seats/${movieId}/${showtimeId}`)}
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            ← Back to Seats
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="text-3xl font-bold">Payment</h1>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold">Payment Details</h2>

            <div className="mt-6 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Cardholder Name
                </label>

                <input
                  type="text"
                  value={cardholderName}
                  onChange={(e) => {
                    setCardholderName(e.target.value);
                    setErrors((prev) => ({
                      ...prev,
                      cardholderName: "",
                    }));
                  }}
                  placeholder="Enter cardholder name"
                  className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
                />

                {errors.cardholderName && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.cardholderName}
                  </p>
                )}
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Card Number
                </label>

                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => {
                    setCardNumber(e.target.value);
                    setErrors((prev) => ({
                      ...prev,
                      cardNumber: "",
                    }));
                  }}
                  placeholder="1234 5678 9012 3456"
                  className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
                />

                {errors.cardNumber && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.cardNumber}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Expiry
                  </label>

                  <input
                    type="text"
                    value={expiry}
                    onChange={(e) => {
                      setExpiry(e.target.value);
                      setErrors((prev) => ({
                        ...prev,
                        expiry: "",
                      }));
                    }}
                    placeholder="MM/YY"
                    className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
                  />

                  {errors.expiry && (
                    <p className="mt-1 text-sm text-red-500">{errors.expiry}</p>
                  )}
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">CVV</label>

                  <input
                    type="password"
                    value={cvv}
                    onChange={(e) => {
                      setCvv(e.target.value);
                      setErrors((prev) => ({
                        ...prev,
                        cvv: "",
                      }));
                    }}
                    placeholder="123"
                    className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
                  />

                  {errors.cvv && (
                    <p className="mt-1 text-sm text-red-500">{errors.cvv}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8 border-t pt-6">
              <label className="mb-2 block text-sm font-medium">
                Coupon Code
              </label>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => {
                    setCouponCode(e.target.value);

                    setCouponError("");

                    setCouponSuccess("");
                  }}
                  placeholder="SAVE10"
                  className="min-w-0 flex-1 rounded-lg border p-3 uppercase outline-none focus:border-blue-500"
                />

                <button
                  onClick={handleApplyCoupon}
                  className="rounded-lg bg-slate-800 px-4 py-3 font-semibold text-white hover:bg-slate-900"
                >
                  Apply
                </button>
              </div>

              {couponError && (
                <p className="mt-2 text-sm text-red-500">{couponError}</p>
              )}

              {couponSuccess && (
                <p className="mt-2 text-sm text-green-600">{couponSuccess}</p>
              )}

              <p className="mt-3 text-xs text-gray-400">
                Try SAVE10 or FLAT200.
              </p>
            </div>
          </section>

          <section className="h-fit rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold">Order Summary</h2>

            <div className="mt-5 space-y-4">
              <div>
                <p className="font-semibold">{movie.title}</p>

                <p className="text-sm text-gray-500">
                  {showtime.date} • {showtime.time}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium">Seats</p>

                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedSeats.map((seat) => (
                    <span
                      key={seat.id}
                      className="rounded bg-pink-100 px-2 py-1 text-xs font-semibold text-pink-700"
                    >
                      {seat.id}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2 border-t pt-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>

                  <span>₹{subtotal}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Discount</span>

                  <span className="text-green-600">-₹{discount}</span>
                </div>

                <div className="flex justify-between border-t pt-3 text-lg font-bold">
                  <span>Total</span>

                  <span>₹{finalAmount}</span>
                </div>
              </div>

              <div className="space-y-3 pt-4">
                <button
                  onClick={handlePaymentSuccess}
                  className="w-full rounded-lg bg-green-600 px-4 py-3 font-semibold text-white hover:bg-green-700"
                >
                  Pay & Success
                </button>

                <button
                  onClick={handlePaymentFailure}
                  className="w-full rounded-lg bg-red-500 px-4 py-3 font-semibold text-white hover:bg-red-600"
                >
                  Simulate Payment Failure
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Payment;
