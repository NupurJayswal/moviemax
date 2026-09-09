import type { Seat as SeatType } from "../types";

interface SeatProps {
  seat: SeatType;
  remainingSeconds: number | null;
  isCurrentUser: boolean;
  onClick: () => void;
}

function Seat({
  seat,
  remainingSeconds,
  isCurrentUser,
  onClick,
}: SeatProps) {
  const isAvailable =
    seat.status === "AVAILABLE";

  const isBooked =
    seat.status === "BOOKED";

  const isHeldByCurrentUser =
    seat.status === "HELD" && isCurrentUser;

  let backgroundClass =
    "bg-blue-100 text-blue-700 border-blue-200";

  if (isBooked) {
    backgroundClass =
      "bg-slate-500 text-white border-slate-500";
  }

  if (isHeldByCurrentUser) {
    backgroundClass =
      "bg-pink-500 text-white border-pink-500";
  }

  return (
    <button
      type="button"
      disabled={!isAvailable && !isHeldByCurrentUser}
      onClick={onClick}
      aria-label={`Seat ${seat.id}`}
      className={`
        relative flex h-12 w-12
        items-center justify-center
        rounded-lg border-2
        text-xs font-bold
        transition
        sm:h-14 sm:w-14
        ${backgroundClass}
        ${
          isAvailable
            ? "cursor-pointer hover:scale-105"
            : "cursor-not-allowed"
        }
      `}
    >
      {seat.id}

      {isHeldByCurrentUser &&
        remainingSeconds !== null && (
          <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-bold text-pink-600">
            {Math.floor(remainingSeconds / 60)}:
            {String(remainingSeconds % 60).padStart(
              2,
              "0"
            )}
          </span>
        )}
    </button>
  );
}

export default Seat;