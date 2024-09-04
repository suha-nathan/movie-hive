"use client";

import { Types } from "mongoose";
import Link from "next/link";
import Image from "next/image";
import { Button } from "../ui/button";
import { useRef } from "react";
import { generateMovieURL, useTruncatedElement } from "@/lib/utils";

import StarsRating from "../shared/StarsRating";

interface Review {
  _id: string;
  title: string;
  text: string;
  tags: [string];
  isSpoiler: boolean;
  numStars: number;
  movie: {
    _id: string;
    tmdbID: number;
    title: string;
    poster: string;
    releaseDate: Date;
  };
  reviewer: {
    _id: string;
    username: string;
    image: string;
  };
}

function ReviewDetailsCard({ review }: { review: Review }) {
  // const ref = useRef<HTMLParagraphElement>(null);

  // const { isTruncated, isShowingMore, toggleIsShowingMore } =
  //   useTruncatedElement({
  //     ref,
  //   });

  return (
    <div className="mt-9 flex flex-col lg:flex-row ">
      <div className="flex flex-col md:flex-row gap-3 px-8">
        <Link
          href={`/movies/${generateMovieURL({
            tmdbID: review.movie.tmdbID,
            title: review.movie.title,
          })}`}
        >
          <Image
            className=""
            width={130}
            height={217}
            src={`${review.movie.poster}`}
            alt="movie poster"
          />
        </Link>

        <div className="flex flex-col h-auto w-96 px-6">
          <div className="flex flex-row h-10 w-full items-center max-xs:justify-center">
            <div className="text-body-normal text-white">
              {review.movie.title}{" "}
            </div>
            <div className="font-extralight leading-[140%] text-light-1 ml-1">
              {"("}
              {review.movie.releaseDate.getFullYear()}
              {")"}
            </div>
          </div>

          <div className="flex flex-row h-16 w-full items-center justify-between max-xs:justify-center">
            <Link
              href={`/profile/${review.reviewer._id}`}
              className="flex flex-row items-center relative h-11 w-[50%]"
            >
              <Image
                src={review.reviewer.image}
                alt="user_community_image"
                height={42}
                width={42}
                className="cursor-pointer rounded-full"
              />
              <h4 className="cursor-pointer text-small-normal text-light-1 ml-2">
                @{review.reviewer.username}
              </h4>
            </Link>
            <StarsRating numStars={review.numStars} />
          </div>

          <p className="text-small-regular text-light-1 flex  max-xs:justify-center">
            {review.text}
          </p>
          <div className="flex flex-row flex-wrap">
            <p className={`paragraph-wrap`}>
              {review.tags?.map((tag: string, index: number) => (
                <span
                  key={`${tag}-${index}`}
                  className="h-auto p-0.5 m-0.5 rounded-md bg-light-4 text-light-1 text-subtle-medium"
                >
                  {tag}
                </span>
              ))}
            </p>
          </div>
        </div>
      </div>
      <div
        className="flex flex-row lg:w-[200px]
      lg:flex-col justify-center lg:justify-start gap-2 
      lg:gap-4"
      >
        <Button className="movie-card-like_btn">
          <span className="hidden sm:inline pr-1">Like Review</span>
          <Image
            src="/assets/heart.svg"
            alt="heart_icon"
            width={20}
            height={20}
          />
        </Button>
        <Button className="movie-card-review_btn" disabled>
          <Link
            href={`/review/new/${review.movie.tmdbID}`}
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
      </div>
    </div>
  );
}

export default ReviewDetailsCard;
