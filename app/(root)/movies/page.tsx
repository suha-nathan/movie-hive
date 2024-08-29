import { redirect } from "next/navigation";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";

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
          <p className="no-result">Search for a user</p>
        ) : (
          <>
            {result.movies.map((movie) => (
              <p className="text-light-1">{movie.title}</p>
            ))}
          </>
        )}
      </div>
    </section>
  );
}

export default Page;
