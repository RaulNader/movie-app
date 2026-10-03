import type { Movie, MovieDetails, Paginated } from "~/types/movie";

const API_URL = "https://api.themoviedb.org/3";
const IMAGE_URL = "https://image.tmdb.org/t/p";
// TMDB refuses pages past 500.
const MAX_PAGE = 500;

interface TmdbMovie {
  id: number;
  title: string;
  overview: string;
  vote_average: number;
  release_date?: string;
  poster_path: string | null;
  backdrop_path: string | null;
}

interface TmdbMovieDetails extends TmdbMovie {
  genres: { id: number; name: string }[];
  runtime: number | null;
}

interface TmdbList {
  page: number;
  total_pages: number;
  results: TmdbMovie[];
}

async function tmdb<T>(path: string, params: Record<string, string> = {}) {
  const token = process.env.TMDB_API_TOKEN;
  if (!token) throw new Error("Missing TMDB_API_TOKEN in .env");

  const url = new URL(API_URL + path);
  url.search = new URLSearchParams(params).toString();

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}`, accept: "application/json" },
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`TMDB request failed: ${res.status}`);
  return (await res.json()) as T;
}

const image = (path: string | null, size: string) =>
  path ? `${IMAGE_URL}/${size}${path}` : null;

function toMovie(m: TmdbMovie): Movie {
  return {
    id: m.id,
    title: m.title,
    description: m.overview,
    rating: m.vote_average,
    year: m.release_date ? Number(m.release_date.slice(0, 4)) : null,
    posterUrl: image(m.poster_path, "w500"),
    backdropUrl: image(m.backdrop_path, "w1280"),
  };
}

export async function getMovies(
  query: string,
  page: number,
): Promise<Paginated<Movie>> {
  const q = query.trim();
  const data = await tmdb<TmdbList>(q ? "/search/movie" : "/movie/popular", {
    page: String(Math.min(page, MAX_PAGE)),
    ...(q && { query: q }),
  });

  return {
    results: data?.results.map(toMovie) ?? [],
    page: data?.page ?? page,
    totalPages: Math.min(data?.total_pages ?? 0, MAX_PAGE),
  };
}

export async function getMovie(id: string): Promise<MovieDetails | null> {
  const m = await tmdb<TmdbMovieDetails>(`/movie/${encodeURIComponent(id)}`);
  if (!m) return null;
  return {
    ...toMovie(m),
    genres: m.genres.map((g) => g.name),
    runtime: m.runtime,
  };
}
