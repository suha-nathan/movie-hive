import { Types } from "mongoose";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";

import { Button } from "@/components/ui/button";
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
          <>
            <p className="no-result py-auto">
              Search for a lists by title, genre, movie, or user
            </p>
            <div className="flex flex-row sm:w-[80vw] justify-between items-end">
              <CarouselHeader
                headerTitle="Popular Lists"
                underlineStyle="w-48 sm:w-96"
              />
              <Button className="h-auto rounded-lg bg-secondary-500 text-[13px] text-light-1 ">
                <Link href="/lists/new" className="flex flex-row" passHref>
                  <span className="hidden sm:inline pr-1">
                    Make Your Own List
                  </span>
                  <Image
                    src="/assets/rectangle-list-regular.svg"
                    alt="list_icon"
                    width={20}
                    height={20}
                  />
                </Link>
              </Button>
            </div>
          </>
        ) : (
          <>
            <CarouselHeader headerTitle={`Results for ${searchParams.q}`} />
            <div
              className="grid lg:grid-cols-2 
      xl:grid-cols-3 w-full gap-y-10 pb-10"
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
