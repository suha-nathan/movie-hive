import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { fetchUser } from "@/lib/actions/user.actions";
import ReviewDetailsCard from "@/components/cards/ReviewDetailsCard";
import CarouselHeader from "@/components/shared/CarouselHeader";
import { fetchReviewByID } from "@/lib/actions/review.action";

export default async function Page({ params }: { params: { id: string } }) {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const userInfo = await fetchUser(user.id);
  if (!userInfo) return null;
  if (!userInfo.onboarded) redirect("/onboarding");

  const review = await fetchReviewByID(params.id);
  // console.log("REVIEW", review);
  //fetch comments by review

  return (
    <div className="mx-auto">
      <ReviewDetailsCard
        review={{
          _id: review._id.toString(),
          title: review.title,
          text: review.text,
          tags: review.tags,
          isSpoiler: review.isSpoiler,
          numStars: review.numStars,
          movie: {
            _id: review.movie._id.toString(),
            tmdbID: review.movie.tmdbID,
            title: review.movie.title,
            poster: review.movie.poster,
            releaseDate: review.movie.releaseDate,
          },
          reviewer: {
            _id: review.reviewer._id.toString(),
            username: review.reviewer.username,
            image: review.reviewer.image,
          },
        }}
      />
      <CarouselHeader headerTitle="Comments" style="mt-4" />
    </div>
  );
}
