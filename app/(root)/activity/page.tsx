import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { currentUser } from "@clerk/nextjs/server";
import { fetchUser, getActivity } from "@/lib/actions/user.actions";

export default async function Page() {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo) return null;
  if (!userInfo.onboarded) return redirect("/onboarding");

  const activity = await getActivity(userInfo._id);
  return (
    <>
      <h1 className="head-text mb-10">Activity</h1>
      <section className="flex flex-col gap-5">
        {activity.length > 0 ? (
          <>
            {activity.map((activity) => (
              <Link key={activity._id} href={`/comment/${activity.parentId}`}>
                <article className="activity-card">
                  <Image
                    src={activity.commenter.image}
                    alt="user_logo"
                    width={30}
                    height={30}
                    className="rounded-full object-cover"
                  />
                  <p className="!text-small-regular text-light-1">
                    <span className="mr-1 text-primary-500">
                      {activity.commenter.name}
                    </span>{" "}
                    replied to your thread
                  </p>
                </article>
              </Link>
            ))}
          </>
        ) : (
          <p className="!text-base-regular text-light-3">No activity yet</p>
        )}
      </section>
    </>
  );
}
