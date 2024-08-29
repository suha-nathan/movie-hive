import { redirect } from "next/navigation";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";

import Searchbar from "@/components/shared/Searchbar";
import { fetchListsBySearch } from "@/lib/actions/list.actions";

async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const userInfo = await fetchUser(user.id);

  if (!userInfo) return null;
  if (!userInfo.onboarded) redirect("/onboarding");

  const result = await fetchListsBySearch({
    searchString: searchParams.q,
    pageNumber: searchParams.page ? +searchParams.page : 1,
    pageSize: 25,
  });

  return (
    <section>
      <Searchbar routeType="lists" />
      <div className="mt-14 flex flex-col gap-9">
        {result.lists.length === 0 ? (
          <p className="no-result">Search for a list</p>
        ) : (
          <>
            {result.lists.map((list) => (
              <p className="text-light-1">{list.title}</p>
            ))}
          </>
        )}
      </div>
    </section>
  );
}

export default Page;
