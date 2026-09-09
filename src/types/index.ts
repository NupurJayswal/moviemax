export type SeatCategory = "Silver" | "Gold" | "Premium";

export type SeatStatus = "AVAILABLE" | "HELD" | "BOOKED";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

export interface Showtime {
  id: string;
  time: string;
  date: string;
}

export interface Movie {
  id: string;
  title: string;
  genre: string;
  duration: string;
  language: string;
  poster: string;
  showtimes: Showtime[];
}

export interface Seat {
  id: string;
  row: string;
  number: number;
  category: SeatCategory;
  price: number;
  status: SeatStatus;
  holdExpiresAt: number | null;
  heldBy: string | null;
}

export interface SelectedSeat {
  id: string;
  row: string;
  number: number;
  category: SeatCategory;
  price: number;
}

export interface Booking {
  id: string;
  userId: string;
  movieId: string;
  movieTitle: string;
  showtimeId: string;
  showtime: Showtime;
  seats: SelectedSeat[];
  subtotal: number;
  discount: number;
  finalAmount: number;
  status: "CONFIRMED" | "CANCELLED";
  createdAt: string;
}