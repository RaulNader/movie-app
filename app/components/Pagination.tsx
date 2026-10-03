import { Link, useSearchParams } from "react-router";

interface PaginationProps {
  page: number;
  totalPages: number;
}

export function Pagination({ page, totalPages }: PaginationProps) {
  const [searchParams] = useSearchParams();
  if (totalPages <= 1) return null;

  // Keep other params (like ?q=) when switching pages.
  const hrefFor = (p: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(p));
    return `?${params}`;
  };

  const base =
    "rounded-lg border border-zinc-800 px-4 py-2 text-sm transition";
  const disabled = `${base} pointer-events-none opacity-40`;
  const enabled = `${base} hover:border-brand hover:text-brand`;

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-center gap-4"
    >
      <Link
        to={hrefFor(page - 1)}
        className={page <= 1 ? disabled : enabled}
        aria-disabled={page <= 1}
      >
        ← Prev
      </Link>
      <span className="text-sm text-zinc-400">
        Page {page} of {totalPages}
      </span>
      <Link
        to={hrefFor(page + 1)}
        className={page >= totalPages ? disabled : enabled}
        aria-disabled={page >= totalPages}
      >
        Next →
      </Link>
    </nav>
  );
}
