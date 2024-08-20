import { currentUser } from "@clerk/nextjs/server";
import { fetchUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import Searchbar from "@/components/shared/Searchbar";
import { fetchLatestMovies } from "@/lib/actions/movie.actions";
import MovieCarousel from "@/components/shared/MovieCarousel";

async function Home() {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);

  if (!userInfo) return null;
  if (!userInfo.onboarded) redirect("/onboarding");

  // const latestMovies = await fetchLatestMovies();

  return (
    <>
      <h1 className="head-text text-left">Home</h1>
      <section className="mt-9 flex flex-col gap-10">
        <Searchbar routeType="movies" />
        <MovieCarousel />
      </section>
    </>
  );
}
export default Home;
