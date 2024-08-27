import Link from "next/link";
import Image from "next/image";
import CommentsCount from "./CommentsCount";
import StarsRating from "./StarsRating";
interface Review {
  _id: string;
  title: string;
  text: string;
  isSpoiler: boolean;
  numStars: number;
  movie: {
    _id: string;
  };
  reviewer: {
    _id: string;
    username: string;
    image: string;
  };
}
interface Props {
  reviews: Review[];
}
function MovieReviews({ reviews }: Props) {
  return (
    <>
      {reviews.map((review: Review) => (
        <Link href={`/review/${review._id}`}>
          <div className="flex flex-col gap-2 px-10 items-center ">
            <div className="flex flex-col gap-2 w-full items-center sm:items-start">
              <div className="flex flex-row items-center">
                <Image
                  src={review.reviewer.image}
                  alt="user_community_image"
                  height={42}
                  width={42}
                  className="cursor-pointer rounded-full"
                />
                <h4 className="cursor-pointer text-small-normal text-light-1 mx-2">
                  @{review.reviewer.username}
                </h4>
              </div>
              <div className="flex flex-row gap-4">
                <StarsRating numStars={review.numStars} />
                {/* TODO: Comments count - count and update */}
                <CommentsCount numComments={300} />
              </div>
            </div>
            <div className="flex flex-col h-auto w-full items-start justify-center">
              <div className="text-body-normal text-white">{review.title} </div>
              <p className="text-small-regular text-light-1 ">{review.text}</p>
            </div>
          </div>
        </Link>
      ))}
    </>
  );
}

export default MovieReviews;
