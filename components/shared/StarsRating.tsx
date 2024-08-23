import Image from "next/image";

function StarsRating({ numStars }: { numStars: number }) {
  return (
    <div className="flex flex-row">
      {Array.from({ length: 5 }, (_, i) => (
        <Image
          key={i}
          src={
            i < numStars ? "/assets/star-solid.svg" : "/assets/star-regular.svg"
          }
          alt={i < numStars ? "solid-star" : "empty-star"}
          width={16}
          height={16}
        />
      ))}
    </div>
  );
}

export default StarsRating;
