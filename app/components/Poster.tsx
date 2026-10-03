interface PosterProps {
  src: string | null;
  alt: string;
  className?: string;
}

export function Poster({ src, alt, className = "" }: PosterProps) {
  if (!src) {
    return (
      <div
        className={`flex aspect-[2/3] items-center justify-center bg-zinc-800 text-sm text-zinc-500 ${className}`}
      >
        No image
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className={`aspect-[2/3] w-full object-cover ${className}`}
    />
  );
}
