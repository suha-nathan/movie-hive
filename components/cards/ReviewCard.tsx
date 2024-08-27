"use client";

import Link from "next/link";
import Image from "next/image";
import { generateMovieURL } from "@/lib/utils";

import StarsRating from "../shared/StarsRating";

interface Review {
  _id: string;
  title: string;
  text: string;
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

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="flex flex-row max-xs:flex-col max-xs:items-center">
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
          alt="Your alt text"
        />
      </Link>
      <Link href={`/review/${review._id}`}>
        <div className="flex flex-col h-56 w-96 px-6">
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
            <StarsRating numStars={review.numStars} />
            {/* TODO: Comments count element */}
            {/* <Link
              href={`/profile/${review.reviewer._id}`} */}
            <div className="flex flex-row items-center relative h-11 w-[50%] px-4">
              {/* > */}
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
              {/* </Link> */}
            </div>
          </div>

          <p className="text-small-regular text-light-1 flex  max-xs:justify-center">
            {review.text}
          </p>

          {/* TODO: Button to Like Review */}
        </div>
      </Link>
    </div>
  );
}

export default ReviewCard;
