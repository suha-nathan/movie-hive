import { Types } from "mongoose";
import Link from "next/link";
import { redirect } from "next/navigation";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";

import CarouselHeader from "@/components/shared/CarouselHeader";
import ListCard from "@/components/cards/ListCard";
import Searchbar from "@/components/shared/Searchbar";
import { fetchListsBySearch } from "@/lib/actions/list.actions";

interface ListType {
  _id: Types.ObjectId;
  title: string;
  description: string;
  creator: {
    _id: Types.ObjectId;
    username: string;
    image: string;
  };
  movies: { poster: string }[];
}

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
        {result?.lists?.length === 0 ? (
          <p className="no-result">
            Search for a lists by title, genre, movie, or user
          </p>
        ) : (
          <>
            <CarouselHeader headerTitle={`Results for ${searchParams.q}`} />
            <div
              className="grid grid-cols-1 md:grid-cols-2 
      lg:grid-cols-3 w-full gap-y-10 pb-10"
            >
              {result?.lists?.map((list: ListType) => (
                <Link href={`/lists/${list._id.toString()}`}>
                  <ListCard
                    list={{
                      _id: list._id.toString(),
                      title: list.title,
                      description: list.description,
                      creator: {
                        _id: list.creator._id.toString(),
                        image: list.creator.image,
                        username: list.creator.username,
                      },
                      movies: list.movies,
                    }}
                  />
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default Page;
