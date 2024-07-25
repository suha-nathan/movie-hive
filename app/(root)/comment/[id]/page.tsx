import CommentCard from "@/components/cards/CommentCard";
import { currentUser } from "@clerk/nextjs/server";
import { fetchUser } from "@/lib/actions/user.actions";
import { fetchCommentById } from "@/lib/actions/comment.actions";
import { redirect } from "next/navigation";

const Page = async ({ params }: { params: { id: string } }) => {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo) return null;
  if (!userInfo.onboarded) redirect("/onboarding");

  const comment = await fetchCommentById(params.id);

  return (
    <section className="relative">
      <div>
        <CommentCard
          key={comment._id}
          id={comment._id}
          currentUserId={user.id}
          parentId={comment.parentId}
          content={comment.text}
          commenter={comment.commenter}
          community={comment.community}
          createdAt={comment.createdAt}
          comments={comment.children}
        />
      </div>
    </section>
  );
};
