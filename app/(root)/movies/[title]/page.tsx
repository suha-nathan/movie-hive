import Image from "next/image";
import { redirect } from "next/navigation";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";

import { parseMovieURL } from "@/lib/utils";
import { fetchMovieByID } from "@/lib/actions/movie.actions";
import MovieCard from "@/components/cards/MovieCard";

async function Page({ params }: { params: { title: string } }) {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const userInfo = await fetchUser(user.id);
  if (!userInfo) return null;
  if (!userInfo.onboarded) redirect("/onboarding");

  const id = parseMovieURL(params.title);
  const movie = await fetchMovieByID(id);

  return (
    <>
      <MovieCard movie={movie} />

      <div>{/* Recent reviews */}</div>

      <div>{/* Popular Lists */}</div>
    </>
  );
}

export default Page;
