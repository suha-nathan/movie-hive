import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { fetchUser } from "@/lib/actions/user.actions";
import { fetchListByID } from "@/lib/actions/list.actions";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { generateMovieURL } from "@/lib/utils";
import CarouselHeader from "@/components/shared/CarouselHeader";

async function Page({ params }: { params: { id: string } }) {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const userInfo = await fetchUser(user.id);
  if (!userInfo) return null;
  if (!userInfo.onboarded) redirect("/onboarding");

  const list = await fetchListByID(params.id);

  console.log("LIST: ", list);
  return (
    <div className="flex flex-col gap-4 mt-4 px-16">
      <h1 className="text-light-1 text-heading2-bold">{list.title}</h1>
      <div className="flex flex-col md:flex-row w-[50vw] justify-between">
        <Link
          href={`/profile/${list.creator._id}`}
          className="flex flex-row items-center relative h-11"
        >
          <Image
            src={list.creator.image}
            alt="user_community_image"
            height={42}
            width={42}
            className="cursor-pointer rounded-full"
          />
          <h4 className="cursor-pointer text-small-normal text-light-1 ml-2">
            @{list.creator.username}
          </h4>
        </Link>
        <div className="flex flex-row items-center">
          <Image
            src="/assets/heart-filled-white.svg"
            alt="number_of_likes"
            width={20}
            height={20}
          />
          <strong className="text-light-1 text-base-bold">{256}</strong>
        </div>
        <Button className="h-auto w-16 sm:w-32 rounded-lg bg-primary-500 text-[13px] text-light-1">
          <span className="hidden sm:inline pr-1">Like List</span>
          <Image
            src="/assets/heart.svg"
            alt="heart_icon"
            width={20}
            height={20}
          />
        </Button>
      </div>
      <p className="text-light-1 text-base-medium w-[50vw]">
        {list.description}
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {list.movies.map((movie: any) => (
          <Link
            key={movie._id.toString()}
            href={`/movies/${generateMovieURL({
              tmdbID: movie.tmdbID,
              title: movie.title,
            })}`}
          >
            <Image
              className=""
              width={130}
              height={217}
              src={`${movie.poster}`}
              alt="movie poster"
            />
          </Link>
        ))}
      </div>
      <CarouselHeader headerTitle="Comments" style="mt-4"/>
    </div>
  );
}

export default Page;
