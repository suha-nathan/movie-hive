"use client";

import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { fetchUser } from "@/lib/actions/user.actions";

import { Button } from "@/components/ui/button";
import { useTruncatedElement } from "@/lib/utils";
import { useRef } from "react";
import { fetchReviewByID } from "@/lib/actions/review.action";

export default async function Page({ params }: { params: { id: string } }) {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const userInfo = await fetchUser(user.id);
  if (!userInfo) return null;
  if (!userInfo.onboarded) redirect("/onboarding");

  const review = await fetchReviewByID(params.id);

  const ref = useRef<HTMLParagraphElement>(null);

  const { isTruncated, isShowingMore, toggleIsShowingMore } =
    useTruncatedElement({
      ref,
    });

  return (
    <div className="mx-auto">
      <section className="mt-9 flex flex-col lg:flex-row ">
        <div className="flex flex-col md:flex-row gap-3 px-8">
          <div className="min-h-60 w-[80vw] md:w-[30%] flex justify-center items-start">
            <Image
              src={review.movie.poster}
              className="object-contain p-1"
              alt="movie poster"
              width={200}
              height={200}
            />
          </div>
          <div className="w-[80%] md:max-w-[40rem] h-auto flex flex-col gap-4 text-light-1 mx-auto">
            {/* ---------------Title--------------- */}
            <div className="text-heading3-bold">
              {review.movie.title}{" "}
              <span className="text-heading3-year items-end">
                {"("}
                {review.movie.releaseDate.getFullYear()}
                {")"}
              </span>
            </div>
            {/* ---------------Description--------------- */}
            <div className="flex flex-col">
              <p
                ref={ref}
                className={`text-base-medium break-words ${
                  !isShowingMore && "line-clamp-4"
                }`}
              >
                {review.text}
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
            <div className="flex flex-row flex-wrap">
              {/* <div className="flex flex-row flex-wrap"> */}
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
              {/* </div> */}
            </div>
          </div>
        </div>
        <div
          className="flex flex-row lg:w-[200px]
      lg:flex-col justify-center lg:justify-start gap-2 
      lg:gap-4 mt-4"
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
          <Button className="movie-card-review_btn">
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
      </section>
    </div>
  );
}
