# MovieMax Architecture

## Overview

MovieMax is a client-side movie ticket booking application built with React,
TypeScript, Redux Toolkit, React Router, Tailwind CSS, static JSON data, and
localStorage.

The application supports login, movie and showtime selection, seat holding,
coupon validation, dummy payment, booking history, and booking cancellation.

## Technology Stack

- React
- TypeScript
- Vite
- Redux Toolkit
- React Router
- Tailwind CSS
- Vitest
- localStorage
- Static JSON data

## Folder Structure

src/
├── app/
│   ├── store.ts
│   └── hooks.ts
├── components/
│   ├── Button.tsx
│   ├── MovieCard.tsx
│   ├── Seat.tsx
│   └── ProtectedRoute.tsx
├── data/
│   ├── movies.json
│   └── seats.json
├── features/
│   ├── auth/
│   ├── movies/
│   ├── reservations/
│   └── bookings/
├── pages/
├── routes/
├── types/
└── utils/
    ├── price.ts
    └── storage.ts