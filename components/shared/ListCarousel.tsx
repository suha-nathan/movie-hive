import ListCard from "../cards/ListCard";

interface Props {
  _id: string;
  title: string;
  description: string;
  creator: { _id: string; image: string; username: string };
  movies: { poster: string }[];
  comments: string[];
}

function ListCarousel({ lists }: { lists: Props[] }) {
  return (
    <div
      className="grid max-md:grid-cols-1 max-xl:grid-cols-2 
    grid-cols-3 w-full gap-y-10 pb-10"
    >
      {lists.map((list) => (
        <ListCard list={list} key={list._id} />
      ))}
    </div>
  );
}

export default ListCarousel;
