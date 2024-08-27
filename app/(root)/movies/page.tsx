import { redirect } from "next/navigation";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";

import Searchbar from "@/components/shared/Searchbar";

async function Page({ params }: { params: { url: string } }) {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const userInfo = await fetchUser(user.id);

  if (!userInfo) return null;
  if (!userInfo.onboarded) redirect("/onboarding");
  return (
    <section className="mt-9 flex flex-col gap-8">
      <Searchbar routeType="movies" />
    </section>
  );
}

export default Page;
