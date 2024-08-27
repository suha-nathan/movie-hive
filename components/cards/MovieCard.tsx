"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

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

const useTruncatedElement = ({
  ref,
}: {
  ref: React.RefObject<HTMLParagraphElement | HTMLDivElement>;
}) => {
  const [isTruncated, setIsTruncated] = useState(false);
  const [isShowingMore, setIsShowingMore] = useState(false);

  useLayoutEffect(() => {
    const { offsetHeight, scrollHeight } = ref.current || {};

    if (offsetHeight && scrollHeight && offsetHeight < scrollHeight) {
      setIsTruncated(true);
    } else {
      setIsTruncated(false);
    }
  }, [ref]);

  const toggleIsShowingMore = () => setIsShowingMore((prev) => !prev);

  return {
    isTruncated,
    isShowingMore,
    toggleIsShowingMore,
  };
};

const MovieCard = ({ movie }: { movie: Props }) => {
  const ref = useRef<HTMLParagraphElement>(null);
  const ref2 = useRef<HTMLParagraphElement>(null);
  const { isTruncated, isShowingMore, toggleIsShowingMore } =
    useTruncatedElement({
      ref,
    });
  const obj2 = useTruncatedElement({
    ref: ref2,
  });
  return (
    <section className="mt-9 flex flex-col items-center gap-3">
      {/* ---------------Poster--------------- */}

      <div className="relative min-h-60 w-[70vw]">
        <Image
          src={movie.poster}
          className="object-contain"
          alt="movie poster"
          fill
        />
      </div>
      <div className="w-64 h-auto flex flex-col gap-4 text-light-1 ">
        {/* ---------------Title--------------- */}
        <div className="text-heading3-bold">
          {movie.title}{" "}
          <span className="text-heading3-year items-end">
            {"("}
            {movie.releaseDate.getFullYear()}
            {")"}
          </span>
        </div>
        <p className="text-base-medium">Director: {movie.director}</p>
        {/* ---------------Description--------------- */}
        <div className="flex flex-col">
          <p
            ref={ref}
            className={`text-base-medium break-words ${
              !isShowingMore && "line-clamp-4"
            }`}
          >
            {movie.description}
          </p>
          {isTruncated && (
            <button
              className="flex justify-end h-auto w-auto p-1 rounded-lg text-[12px] bg-override text-light-1 underline"
              onClick={toggleIsShowingMore}
            >
              {isShowingMore ? "Show Less" : "Show More"}
            </button>
          )}
        </div>
        {/* ---------------Cast--------------- */}
        <div className="flex flex-col ">
          <div className="flex flex-row flex-wrap">
            <p
              ref={ref2}
              className={`paragraph-wrap ${
                !obj2.isShowingMore && "line-clamp-4"
              }`}
            >
              {movie.cast.map((person) => (
                <span className="h-auto p-0.5 m-0.5 rounded-md bg-light-4 text-light-1 text-subtle-medium">
                  {person}
                </span>
              ))}
            </p>
          </div>
          {obj2.isTruncated && (
            <button
              className="flex justify-end h-auto w-auto p-1 rounded-lg text-[12px] bg-override text-light-1 underline"
              onClick={obj2.toggleIsShowingMore}
            >
              {obj2.isShowingMore ? "Show Less" : "Show More"}
            </button>
          )}
        </div>
        {/* ---------------Runtime and Genre--------------- */}
        <div className="flex flex-row text-base-medium text-light-1">
          {" "}
          Runtime: {movie.runtime} min
        </div>
        <div className="flex flex-row flex-wrap text-base-medium text-light-1">
          Genres:
          {movie.genres.map((genre) => (
            <span className="h-auto p-0.5 m-0.5 rounded-md bg-blue text-light-1 text-subtle-medium">
              {genre}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MovieCard;
