import { useRouter } from "next/router";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { fetchUser } from "@/lib/actions/user.actions";

export default async function Page({ params }: { params: { id: string } }) {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const userInfo = await fetchUser(user.id);
  if (!userInfo) return null;
  if (!userInfo.onboarded) redirect("/onboarding");

  return (
    <div>
      <h1>Review Detail: {params.id}</h1>
      {/* Display the review content */}
    </div>
  );
}
