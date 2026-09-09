import type { Booking, Seat, User } from "../types";

const KEYS = {
  USER: "moviemax_user",
  BOOKINGS: "moviemax_bookings",
  SEATS: "moviemax_seats",
};

export const storage = {
  getUser(): User | null {
    const data = localStorage.getItem(KEYS.USER);
    return data ? JSON.parse(data) : null;
  },

  setUser(user: User): void {
    localStorage.setItem(KEYS.USER, JSON.stringify(user));
  },

  removeUser(): void {
    localStorage.removeItem(KEYS.USER);
  },

  getBookings(): Booking[] {
    const data = localStorage.getItem(KEYS.BOOKINGS);
    return data ? JSON.parse(data) : [];
  },

  setBookings(bookings: Booking[]): void {
    localStorage.setItem(KEYS.BOOKINGS, JSON.stringify(bookings));
  },

  getSeats(): Record<string, Seat[]> {
    const data = localStorage.getItem(KEYS.SEATS);
    return data ? JSON.parse(data) : {};
  },

  setSeats(seats: Record<string, Seat[]>): void {
    localStorage.setItem(KEYS.SEATS, JSON.stringify(seats));
  },
};