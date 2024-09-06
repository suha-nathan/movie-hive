import { redirect } from "next/navigation";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import CreateList from "@/components/forms/CreateList";

import CarouselHeader from "@/components/shared/CarouselHeader";

async function Page({ params }: { params: { movieId: string } }) {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const userInfo = await fetchUser(user.id);

  if (!userInfo) return null;
  if (!userInfo.onboarded) redirect("/onboarding");

  return (
    <div className="mt-10">
      <CarouselHeader
        headerTitle="Create a Personalised List"
        underlineStyle="w-full sm:w-96"
      />
      <CreateList userId={userInfo._id.toString()} className="mt-10" />
    </div>
  );
}

export default Page;
