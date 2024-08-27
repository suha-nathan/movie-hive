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
    tmdbID: number;
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
    <div className="flex flex-col">
      {reviews.map((review: Review) => (
        <ReviewCard key={review._id} review={review} />
      ))}
    </div>
  );
}

export default ReviewSection;
