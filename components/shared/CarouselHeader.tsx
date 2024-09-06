import React from "react";

function CarouselHeader({
  headerTitle,
  style = "",
  underlineStyle = "w-[30vw]",
}: {
  headerTitle: string;
  style?: string;
  underlineStyle?: string;
}) {
  return (
    <div className={`flex flex-col items-start ${style}`}>
      <div className="sub-head-text">{headerTitle}</div>
      <div
        className={`relative h-0.5 grow rounded-full  bg-light-4 ${underlineStyle}`}
      />
    </div>
  );
}

export default CarouselHeader;
