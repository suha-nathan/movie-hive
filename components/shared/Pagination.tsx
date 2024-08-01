import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
interface Props {
  pageNumber: number;
  isNext: boolean;
  path: string;
}

export default function Pagination({ pageNumber, isNext, path }: Props) {
  const router = useRouter();

  const handleNavigation = (type: string) => {};
  return (
    <div className="pagination">
      <Button
        onClick={() => handleNavigation("prev")}
        className="text-small-regular text-light-2"
      >
        Prev
      </Button>
    </div>
  );
}
