export interface Movie {
  id: number;
  title: string;
  description: string;
  /** Rating out of 10 */
  rating: number;
  year: number | null;
  posterUrl: string | null;
  backdropUrl: string | null;
}

export interface MovieDetails extends Movie {
  genres: string[];
  runtime: number | null;
}

export interface Paginated<T> {
  results: T[];
  page: number;
  totalPages: number;
}
