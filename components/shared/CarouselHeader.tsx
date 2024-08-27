import React from "react";

function CarouselHeader({
  headerTitle,
  style,
}: {
  headerTitle: string;
  style?: string;
}) {
  return (
    <div className={`mb-4 flex flex-col items-start px-10 ${style}`}>
      <div className="sub-head-text">{headerTitle}</div>
      <div className="relative h-0.5 w-[80vw] sm:w-[40vw] grow rounded-full  bg-light-4" />
    </div>
  );
}

export default CarouselHeader;
