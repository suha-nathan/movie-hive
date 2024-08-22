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
    <div className="flex flex-row mr-2">
      {lists.map((list) => (
        <ListCard list={list} key={list._id} />
      ))}
    </div>
  );
}

export default ListCarousel;
