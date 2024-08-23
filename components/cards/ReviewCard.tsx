"use client";

import Link from "next/link";
import Image from "next/image";
import { generateMovieURL } from "@/lib/utils";

import StarsRating from "../shared/StarsRating";
import Movie from "@/lib/models/movie.model";

interface Review {
  _id: string;
  title: string;
  text: string;
  isSpoiler: boolean;
  numStars: number;
  movie: {
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
    <div className="flex flex-row">
      <Link
        href={`/movies/${generateMovieURL({
          title: review.movie.title,
          releaseDate: review.movie.releaseDate,
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
      <div className="flex flex-col h-56 w-96 px-6">
        <div className="flex flex-row h-10 w-full items-center ">
          <div className="text-body-normal text-white">
            {review.movie.title}{" "}
          </div>
          <div className="font-extralight leading-[140%] text-light-1 ml-1">
            {"("}
            {review.movie.releaseDate.getFullYear()}
            {")"}
          </div>
        </div>

        <div className="flex flex-row h-16 w-full items-center justify-between">
          <StarsRating numStars={review.numStars} />
          {/* TODO: Comments count element */}
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
        </div>

        <p className="text-small-regular text-light-1">{review.text}</p>

        {/* TODO: Button to Like Review */}
      </div>
    </div>
  );
}

export default ReviewCard;
