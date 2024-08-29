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
    <section className="mt-9 flex flex-col lg:flex-row ">
      {/* ---------------Poster--------------- */}
      <div className="flex flex-col md:flex-row gap-3 px-8">
        <div className="min-h-60 w-[80vw] md:w-[30%] flex justify-center items-start">
          <Image
            src={movie.poster}
            className="object-contain p-1"
            alt="movie poster"
            width={200}
            height={200}
          />
        </div>
        <div className="w-[80%] md:max-w-[40rem] h-auto flex flex-col gap-4 text-light-1 mx-auto">
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
                  !obj2.isShowingMore && "line-clamp-2"
                }`}
              >
                {movie.cast.map((person, index) => (
                  <span
                    key={`${person}-${index}`}
                    className="h-auto p-0.5 m-0.5 rounded-md bg-light-4 text-light-1 text-subtle-medium"
                  >
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
            {movie.genres.map((genre, index) => (
              <span
                key={`${genre}-${index}`}
                className="h-auto p-0.5 m-0.5 rounded-md bg-blue text-light-1 text-subtle-medium"
              >
                {genre}
              </span>
            ))}
          </div>
        </div>
      </div>
      {/* --------------- Buttons --------------- */}
      <div
        className="flex flex-row lg:w-[200px]
      lg:flex-col justify-center lg:justify-start gap-2 
      lg:gap-4 mt-4"
      >
        <Button className="movie-card-like_btn">
          <span className="hidden sm:inline pr-1">Like Movie</span>
          <Image
            src="/assets/heart.svg"
            alt="heart_icon"
            width={20}
            height={20}
          />
        </Button>
        <Button className="movie-card-review_btn">
          <Link
            href={`/review/new/${movie.tmdbID}`}
            className="flex flex-row"
            passHref
          >
            <span className="hidden sm:inline pr-1">Leave Review</span>

            <Image
              src="/assets/pen-solid.svg"
              alt="pen_icon"
              width={20}
              height={20}
            />
          </Link>
        </Button>
        <Button className="movie-card-list_btn">
          <span className="hidden sm:inline pr-1">Make List</span>
          <Image
            src="/assets/rectangle-list-regular.svg"
            alt="list_icon"
            width={20}
            height={20}
          />
        </Button>
      </div>
    </section>
  );
};

export default MovieCard;
