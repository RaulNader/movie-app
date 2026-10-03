import { Link } from "react-router";
import type { Movie } from "~/types/movie";
import { Poster } from "./Poster";
import { Rating } from "./Rating";

export function MovieCard({ movie }: { movie: Movie }) {
  return (
    <Link
      to={`/movies/${movie.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 transition hover:-translate-y-1 hover:border-brand"
    >
      <Poster src={movie.posterUrl} alt={`${movie.title} poster`} />
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h2 className="font-bold group-hover:text-brand">{movie.title}</h2>
          {movie.year && (
            <span className="text-sm text-zinc-500">{movie.year}</span>
          )}
        </div>
        <p className="line-clamp-3 text-sm text-zinc-400">
          {movie.description}
        </p>
        <div className="mt-auto pt-2">
          <Rating value={movie.rating} />
        </div>
      </div>
    </Link>
  );
}
