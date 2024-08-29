import Link from "next/link";
import Image from "next/image";

import { redirect } from "next/navigation";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";

import { generateMovieURL } from "@/lib/utils";
import CarouselHeader from "@/components/shared/CarouselHeader";
import Searchbar from "@/components/shared/Searchbar";
import { fetchMoviesBySearch } from "@/lib/actions/movie.actions";

async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const userInfo = await fetchUser(user.id);

  if (!userInfo) return null;
  if (!userInfo.onboarded) redirect("/onboarding");

  const result = await fetchMoviesBySearch({
    searchString: searchParams.q,
    pageNumber: searchParams.page ? +searchParams.page : 1,
    pageSize: 25,
  });

  return (
    <section>
      <Searchbar routeType="movies" />
      <div className="mt-14 flex flex-col gap-9">
        {result.movies.length === 0 ? (
          <p className="no-result">
            Search for a movie by title, genre, or director{" "}
          </p>
        ) : (
          <>
            <CarouselHeader headerTitle={`Results for ${searchParams.q}`} />
            <div className="px-10 flex flex-wrap flex-row gap-2">
              {result.movies.map((movie) => (
                <Link
                  href={`/movies/${generateMovieURL({
                    tmdbID: movie.tmdbID,
                    title: movie.title,
                  })}`}
                >
                  <Image
                    className=""
                    width={130}
                    height={217}
                    src={`${movie.poster}`}
                    alt="movie poster"
                  />
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default Page;
