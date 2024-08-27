import { EmblaOptionsType } from "embla-carousel";
import EmblaCarousel from "@/components/shared/EmblaCarousel";
import CarouselHeader from "@/components/shared/CarouselHeader";
import ListCarousel from "@/components/shared/ListCarousel";
import ReviewSection from "@/components/shared/ReviewSection";

import { redirect } from "next/navigation";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";

import { fetchLatestMovies } from "@/lib/actions/movie.actions";
import { fetchLists } from "@/lib/actions/list.actions";

async function Home() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const userInfo = await fetchUser(user.id);

  if (!userInfo) return null;
  if (!userInfo.onboarded) redirect("/onboarding");

  const OPTIONS: EmblaOptionsType = { dragFree: true, loop: true };

  const latestMovies = await fetchLatestMovies();
  const lists = await fetchLists();
  return (
    <>
      <section className="mt-9 flex flex-col">
        <CarouselHeader headerTitle="Recent Movies" />
        <EmblaCarousel slides={latestMovies} options={OPTIONS} />

        <CarouselHeader headerTitle="Popular Lists" />
        <ListCarousel lists={lists} />

        <CarouselHeader headerTitle="Popular Reviews" />
        <ReviewSection />
      </section>
    </>
  );
}
export default Home;
