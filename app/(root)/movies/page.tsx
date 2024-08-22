import Searchbar from "@/components/shared/Searchbar";

function Page() {
  return (
    <section className="mt-9 flex flex-col gap-8">
      <Searchbar routeType="movies" />
    </section>
  );
}

export default Page;
