import { redirect } from "next/navigation";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import CreateReview from "@/components/forms/CreateReview";

import { fetchMovieByID } from "@/lib/actions/movie.actions";

async function Page({ params }: { params: { movieId: string } }) {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const userInfo = await fetchUser(user.id);

  if (!userInfo) return null;
  if (!userInfo.onboarded) redirect("/onboarding");

  const movieInfo = await fetchMovieByID(params.movieId);

  return (
    <CreateReview
      userId={userInfo._id.toString()}
      movieId={movieInfo._id.toString()}
    />
  );
}

export default Page;
