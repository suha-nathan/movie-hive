import React from "react";

function CarouselHeader({ headerTitle }: { headerTitle: string }) {
  return (
    <>
      <div className="sub-head-text">{headerTitle}</div>
      <div className="relative -top-5 h-0.5 w-[40vw] grow rounded-full  bg-light-4" />
    </>
  );
}

export default CarouselHeader;
