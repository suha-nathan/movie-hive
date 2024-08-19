import { currentUser } from "@clerk/nextjs/server";
import { fetchUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import { fetchComments } from "@/lib/actions/comment.actions";
import CommentCard from "@/components/cards/CommentCard";

async function Home() {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);

  if (!userInfo) return null;
  if (!userInfo.onboarded) redirect("/onboarding");

  const result = await fetchComments(1, 30);

  return (
    <>
      <h1 className="head-text text-left">Home</h1>
      <section className="mt-9 flex flex-col gap-10">
        {result.comments.length === 0 ? (
          <p className="no-result">No threads found</p>
        ) : (
          result.comments.map((comment) => (
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
          ))
        )}
      </section>
    </>
  );
}
export default Home;
