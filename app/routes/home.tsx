import { Form } from "react-router";
import { MovieCard } from "~/components/MovieCard";
import { Pagination } from "~/components/Pagination";
import { getMovies } from "~/lib/tmdb.server";
import type { Route } from "./+types/home";

export function meta(): Route.MetaDescriptors {
  return [{ title: "MovieBox" }];
}

export async function loader({ request }: Route.LoaderArgs) {
  const params = new URL(request.url).searchParams;
  const q = params.get("q") ?? "";
  const page = Math.max(1, Number(params.get("page")) || 1);

  return { ...(await getMovies(q, page)), q };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { results, page, totalPages, q } = loaderData;

  return (
    <section className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-3xl font-bold">
          {q ? `Results for "${q}"` : "Popular Movies"}
        </h1>
        {/* No page input here, so a new search starts at page 1. */}
        <Form className="w-full sm:w-72">
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Search movies…"
            className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2 outline-none focus:border-brand"
          />
        </Form>
      </div>

      {results.length === 0 ? (
        <p className="text-zinc-400">No movies found.</p>
      ) : (
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
          {results.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} />
    </section>
  );
}
