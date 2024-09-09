import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { fetchUser } from "@/lib/actions/user.actions";
import ReviewDetailsCard from "@/components/cards/ReviewDetailsCard";
import CarouselHeader from "@/components/shared/CarouselHeader";
import { fetchReviewByID } from "@/lib/actions/review.action";

import PostComment from "@/components/forms/PostComment";
import CommentCard from "@/components/cards/CommentCard";
import { fetchTopLevelComments } from "@/lib/actions/comment.actions";
import { TrendingUp } from "lucide-react";

export default async function Page({ params }: { params: { id: string } }) {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const userInfo = await fetchUser(user.id);
  if (!userInfo) return null;
  if (!userInfo.onboarded) redirect("/onboarding");

  const review = await fetchReviewByID(params.id);

  const comments = await fetchTopLevelComments(params.id);
  //fetch comments by review
  if (!review) redirect("/");

  return (
    <div className="flex flex-col gap-4 mt-4 px-16 mb-44">
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
      {comments?.length > 0 ? (
        comments.map((comment: any) => (
          <CommentCard
            key={comment._id.toString()}
            currentUser={userInfo._id.toString()}
            id={comment._id.toString()}
            text={comment.text}
            commenter={{
              id: comment.commenter._id.toString(),
              image: comment.commenter.image,
              username: comment.commenter.username,
            }}
            parentComment={
              comment.parentComment ? comment.parentComment.toString() : null
            }
            replyToUsername={comment.replyToUsername}
            replyToUser={comment.replyToUser}
            numReplies={comment.numReplies}
            createdAt={comment.createdAt}
            updatedAt={comment.updatedAt}
            userID={userInfo._id.toString()}
            userImage={userInfo.image}
            postID={review._id.toString()}
            postType="Review"
          />
        ))
      ) : (
        <p className="no-result">No comments</p>
      )}

      <PostComment
        userID={userInfo._id.toString()}
        image={userInfo.image}
        postID={review._id.toString()}
        postType="Review"
        isCommentCardShown={true}
      />
    </div>
  );
}
