import { fetchReviews } from "@/lib/actions/review.action";
import ReviewCard from "../cards/ReviewCard";

interface Review {
  _id: string;
  title: string;
  text: string;
  isSpoiler: boolean;
  numStars: number;
  movie: {
    _id: string;
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

async function ReviewSection() {
  const reviews = await fetchReviews();
  return (
    <>
      {reviews.map((review: Review) => (
        <ReviewCard key={review._id} review={review} />
      ))}
    </>
  );
}

export default ReviewSection;
