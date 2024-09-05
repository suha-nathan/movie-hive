import { redirect } from "next/navigation";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";

import { Modal } from "./modal";
import CreateReview from "@/components/forms/CreateReview";

import { fetchMovieByID } from "@/lib/actions/movie.actions";

export default async function Page({
  params,
}: {
  params: { movieId: string };
}) {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const userInfo = await fetchUser(user.id);

  if (!userInfo) return null;
  if (!userInfo.onboarded) redirect("/onboarding");

  const movieInfo = await fetchMovieByID(params.movieId);

  return (
    <Modal>
      <CreateReview
        userId={userInfo._id.toString()}
        movieId={movieInfo._id.toString()}
        className="mt-2"
      />
    </Modal>
  );
}
