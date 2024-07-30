import { fetchUserComments } from "@/lib/actions/user.actions";
import { fetchCommunityComments } from "@/lib/actions/community.actions";
import CommentCard from "../cards/CommentCard";
import { redirect } from "next/navigation";

interface Result {
  name: string;
  image: string;
  id: string;
  comments: {
    _id: string;
    text: string;
    parentId: string | null;
    commenter: {
      name: string;
      image: string;
      id: string;
    };
    community: {
      id: string;
      name: string;
      image: string;
    } | null;
    createdAt: string;
    children: {
      commenter: {
        image: string;
      };
    }[];
  }[];
}

interface Props {
  profileId: string;
  currentUserId: string;
  profileType: string;
}

export default async function CommentsTab({
  profileId,
  currentUserId,
  profileType,
}: Props) {
  let result: Result;
  result =
    profileType !== "Community"
      ? await fetchUserComments(profileId)
      : fetchCommunityComments(profileId);
  if (!result) redirect("/");
  return (
    <section className="mt-9 flex flex-col gap-10">
      {result.comments.map((comment) => (
        <CommentCard
          key={comment._id}
          id={comment._id}
          currentUserId={currentUserId}
          parentId={comment.parentId}
          content={comment.text}
          commenter={
            profileType === "User"
              ? { name: result.name, image: result.image, id: result.id }
              : {
                  name: comment.commenter.name,
                  image: comment.commenter.image,
                  id: comment.commenter.id,
                }
          }
          community={
            profileType === "Community"
              ? { name: result.name, id: result.id, image: result.image }
              : comment.community
          }
          createdAt={comment.createdAt}
          comments={comment.children}
        />
      ))}
    </section>
  );
}
