import Image from "next/image";
import Link from "next/link";

interface Props {
  title: string;
  description: string;
  creator: { _id: string; image: string; username: string };
  movies: { poster: string }[];
  comments: string[];
}

function ListCard({ list }: { list: Props }) {
  return (
    <div className="flex w-48 flex-col">
      <div className="flex items-center relative">
        <Image
          src={list.movies[1].poster}
          alt="movie_poster_0"
          width={156}
          height={259}
          className="relative z-10 w-auto h-[259px] rounded-xl "
        />
        <Image
          src={list.movies[0].poster}
          alt="movie_poster_1"
          width={163}
          height={270}
          className="relative z-20 -left-28 w-auto h-[280px] rounded-xl drop-shadow-[0_35px_35px_rgba(0,0,0,0.25)]"
        />
        <Image
          src={list.movies[2].poster}
          alt="movie_poster_2"
          width={156}
          height={259}
          className="relative z-10 -left-56 w-auto h-[259px] rounded-xl"
        />
      </div>
      <div className="h-14 w-72 mt-4">
        <h4 className="text-light-1 text-left text-base-medium mb-2">
          {list.title}
        </h4>
        <div className="flex flex-row w-full">
          <Link
            href={`/profile/${list.creator._id}`}
            className="flex flex-row items-center relative h-11 w-[50%]"
          >
            <Image
              src={list.creator.image}
              alt="user_profile_image"
              height={44}
              width={44}
              className="cursor-pointer rounded-full"
            />
            <h4 className="cursor-pointer text-base-semibold text-light-1 ml-2">
              @{list.creator.username}
            </h4>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ListCard;
