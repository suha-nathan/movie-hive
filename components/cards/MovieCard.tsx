"use client";
import Image from "next/image";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Props {
  tmdbID: number;
  title: string;
  director: string;
  cast: [string];
  description: string;
  poster: string;
  backdrop: string;
  runtime: number;
  genres: [string];
  releaseDate: Date;
}

const MovieCard = (movie: Props) => {
  const router = useRouter();

  return (
    <article className="user-card">
      <div className="user-card_avatar">
        <Link
          href={`/movies/${movie.title}-${movie.releaseDate.getFullYear()}`}
          className="relative h-[259px] w-[156px]"
        >
          <Image src={movie.poster} alt="movie_poster" fill />
        </Link>
      </div>
    </article>
  );
};

export default MovieCard;
