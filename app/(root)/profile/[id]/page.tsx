import { currentUser } from "@clerk/nextjs/server";
import { fetchUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import PostThread from "@/components/forms/PostThread";
import ProfileHeader from "@/components/shared/ProfileHeader";

async function Page({ params }: { params: { id: string } }) {
  const user = await currentUser();
  if (!user) return null;
  const userInfo = await fetchUser(params.id);

  if (!userInfo?.onboarded) redirect("/onboarding");
  return (
    <section>
      <ProfileHeader
        profileId={userInfo.id}
        currentUserId={user.id}
        name={userInfo.name}
        username={userInfo.username}
        imgUrl={userInfo.image}
        bio={userInfo.bio}
      />
    </section>
  );
}

export default Page;
