import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { fetchUser } from "@/lib/actions/user.actions";
import { fetchListByID } from "@/lib/actions/list.actions";
import Image from "next/image";
import { Button } from "@/components/ui/button";

async function Page({ params }: { params: { id: string } }) {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const userInfo = await fetchUser(user.id);
  if (!userInfo) return null;
  if (!userInfo.onboarded) redirect("/onboarding");

  const list = await fetchListByID(params.id);

  console.log("LIST: ", list);
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-light-1 text-heading2-bold">{list.title}</h1>
      <div className="flex flex-col md:flex-row ">
        <div className="flex flex-row items-center">
          <Image
            src="/assets/heart-filled-white.svg"
            alt="number_of_likes"
            width={20}
            height={20}
          />
          <strong className="text-light-1 text-base-bold">{256}</strong>
        </div>
        <Button className="h-auto max-w-[100px] rounded-lg bg-primary-500 text-[13px] text-light-1">
          <span className="hidden sm:inline pr-1">Like Review</span>
          <Image
            src="/assets/heart.svg"
            alt="heart_icon"
            width={20}
            height={20}
          />
        </Button>
      </div>
    </div>
  );
}

export default Page;
