import { redirect } from "next/navigation";
import { EmblaOptionsType } from "embla-carousel";
import EmblaCarousel from "@/components/shared/EmblaCarousel";
import Searchbar from "@/components/shared/Searchbar";
import CarouselHeader from "@/components/shared/CarouselHeader";
import ListCarousel from "@/components/shared/ListCarousel";

import { fetchLatestMovies } from "@/lib/actions/movie.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import { fetchLists } from "@/lib/actions/list.actions";

async function Home() {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);

  if (!userInfo) return null;
  if (!userInfo.onboarded) redirect("/onboarding");

  const OPTIONS: EmblaOptionsType = { dragFree: true, loop: true };

  const latestMovies = await fetchLatestMovies();
  const lists = await fetchLists();
  return (
    <>
      <section className="mt-9 flex flex-col gap-8">
        <Searchbar routeType="movies" />
        <CarouselHeader headerTitle="Recent Movies" />
        <EmblaCarousel slides={latestMovies} options={OPTIONS} />

        <CarouselHeader headerTitle="Popular Lists" />
        {/* <ListCarousel lists={lists} /> */}
        <CarouselHeader headerTitle="Popular Reviews" />
      </section>
    </>
  );
}
export default Home;
