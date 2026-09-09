start time - 6:10 PM
End time - 12:10 AM
Total time: 6 HOURS

How to Run

Install dependencies:

npm install

Start the development server:

npm run dev

Run unit tests:

npm run test:run

MovieMax is a React-based movie ticket booking mini-application built as a practical assignment.

The application allows users to log in, browse movies and showtimes, select seats, hold seats temporarily, apply coupons, simulate payment, view booking history, and cancel upcoming bookings.

Tech Stack
React
TypeScript
Vite
Redux Toolkit
React Router
Tailwind CSS
Vitest
localStorage
Static JSON data
Features
Authentication
Hardcoded demo user authentication
Client-side login validation
Authentication state stored in Redux
Login session persisted using localStorage
Protected routes
Logout functionality
Movies & Showtimes
4 movies
2 showtimes per movie
Static JSON movie data
Movie and showtime selection
Seat Selection
Dynamic seat map
40 seats across rows A–E
Silver, Gold and Premium categories
Different prices based on seat category
Available, Held and Booked seat states
3-minute seat hold
Per-seat countdown timer
Automatic expiration of held seats
Booked seats cannot be selected
Seat state persists across browser refreshes
Coupons

Supported coupons:

SAVE10 — 10% discount
FLAT200 — ₹200 discount when at least 3 seats are selected

Invalid coupons and unmet conditions are displayed as inline validation messages.

Payment

Dummy payment flow with two outcomes:

Payment Success
Payment Failure

Successful payment:

Validates active seat holds.
Creates a booking.
Converts HELD seats to BOOKED.
Persists the booking.
Redirects to the success page.

Failed payment:

Keeps the seats held.
Shows the failure page.
Allows the user to retry payment.
Booking History
Shows bookings for the logged-in user
Most recent bookings appear first
Displays movie, showtime, seats and amount
Displays booking status
Allows cancellation of confirmed bookings
Cancellation releases the booked seats