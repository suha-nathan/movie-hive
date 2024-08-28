import Image from "next/image";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { fetchUser } from "@/lib/actions/user.actions";
import { parseMovieURL } from "@/lib/utils";
import { fetchMovieByID } from "@/lib/actions/movie.actions";
import { fetchReviewsByMovie } from "@/lib/actions/review.action";

import MovieCard from "@/components/cards/MovieCard";
import CarouselHeader from "@/components/shared/CarouselHeader";
import MovieReviews from "@/components/shared/MovieReviews";

async function Page({ params }: { params: { id: string } }) {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const userInfo = await fetchUser(user.id);
  if (!userInfo) return null;
  if (!userInfo.onboarded) redirect("/onboarding");

  const id = parseMovieURL(params.id);
  const movie = await fetchMovieByID(id);
  const reviews = await fetchReviewsByMovie(movie._id.toString());

  //TODO
  // const lists = await fetchListsByMovie(movie._id.toString())

  return (
    <div className="mx-auto">
      <MovieCard movie={movie} />

      {/* Recent reviews */}
      <CarouselHeader headerTitle="Recent Reviews" style="mt-4" />
      <MovieReviews reviews={reviews} />

      <div>{/* Popular Lists */}</div>
      <CarouselHeader headerTitle="Included in Lists" style="mt-4" />
    </div>
  );
}

export default Page;
