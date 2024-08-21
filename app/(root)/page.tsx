import { redirect } from "next/navigation";
import { EmblaOptionsType } from "embla-carousel";
import EmblaCarousel from "@/components/shared/EmblaCarousel";
import Searchbar from "@/components/shared/Searchbar";
import CarouselHeader from "@/components/shared/CarouselHeader";

import { fetchLatestMovies } from "@/lib/actions/movie.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";

async function Home() {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);

  if (!userInfo) return null;
  if (!userInfo.onboarded) redirect("/onboarding");

  const OPTIONS: EmblaOptionsType = { dragFree: true, loop: true };

  const latestMovies = await fetchLatestMovies();

  return (
    <>
      <h1 className="head-text text-left">Home</h1>
      <section className="mt-9 flex flex-col gap-10">
        <Searchbar routeType="movies" />
        <CarouselHeader />
        <EmblaCarousel slides={latestMovies} options={OPTIONS} />
      </section>
    </>
  );
}
export default Home;
