import { data, Link } from "react-router";
import { Poster } from "~/components/Poster";
import { Rating } from "~/components/Rating";
import { getMovie } from "~/lib/tmdb.server";
import type { Route } from "./+types/movie";

export async function loader({ params }: Route.LoaderArgs) {
  const movie = await getMovie(params.movieId);
  if (!movie) throw data(null, { status: 404, statusText: "Movie not found" });
  return { movie };
}

export function meta({ data }: Route.MetaArgs): Route.MetaDescriptors {
  return [{ title: data ? `${data.movie.title} | MovieBox` : "MovieBox" }];
}

export default function MovieDetails({ loaderData }: Route.ComponentProps) {
  const { movie } = loaderData;

  return (
    <article className="space-y-6">
      <Link to="/" className="text-sm text-zinc-400 hover:text-brand">
        ← All movies
      </Link>

      {movie.backdropUrl && (
        <img
          src={movie.backdropUrl}
          alt=""
          className="aspect-video w-full rounded-xl object-cover opacity-60"
        />
      )}

      <div className="flex flex-col gap-8 sm:flex-row">
        <Poster
          src={movie.posterUrl}
          alt={`${movie.title} poster`}
          className="w-48 shrink-0 self-start rounded-xl"
        />
        <div className="space-y-4">
          <header className="space-y-2">
            <h1 className="text-4xl font-black">{movie.title}</h1>
            <p className="text-zinc-500">
              {[movie.year, movie.runtime && `${movie.runtime} min`]
                .filter(Boolean)
                .join(" · ")}
            </p>
            <Rating value={movie.rating} />
          </header>
          <ul className="flex flex-wrap gap-2">
            {movie.genres.map((genre) => (
              <li
                key={genre}
                className="rounded-full bg-zinc-800 px-3 py-1 text-xs"
              >
                {genre}
              </li>
            ))}
          </ul>
          <p className="text-lg leading-relaxed text-zinc-300">
            {movie.description || "No description available."}
          </p>
        </div>
      </div>
    </article>
  );
}
