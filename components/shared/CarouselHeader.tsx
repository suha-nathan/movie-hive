import React from "react";

function CarouselHeader({ headerTitle }: { headerTitle: string }) {
  return (
    <div className="mb-8">
      <div className="sub-head-text">{headerTitle}</div>
      <div className="relative h-0.5 w-[40vw] grow rounded-full  bg-light-4" />
    </div>
  );
}

export default CarouselHeader;
