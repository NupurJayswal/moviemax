import type { Movie } from "../types";

interface MovieCardProps {
  movie: Movie;
  onSelectShow: (movie: Movie) => void;
}

function MovieCard({
  movie,
  onSelectShow,
}: MovieCardProps) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <img
        src={movie.poster}
        alt={movie.title}
        className="h-72 w-full object-cover"
      />

      <div className="p-5">
        <h3 className="text-xl font-bold">
          {movie.title}
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          {movie.genre}
        </p>

        <p className="mt-1 text-sm text-gray-500">
          {movie.duration} • {movie.language}
        </p>

        <button
          onClick={() => onSelectShow(movie)}
          className="mt-4 w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          Select Showtime
        </button>
      </div>
    </div>
  );
}

export default MovieCard;