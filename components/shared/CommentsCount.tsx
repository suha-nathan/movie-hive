import Image from "next/image";
import React from "react";

function CommentsCount({ numComments }: { numComments: number }) {
  return (
    <div className="text-light-1 text-small-regular flex flex-row">
      <Image
        src="/assets/comment-solid.svg"
        alt="comments"
        width={16}
        height={16}
      />
      {numComments}
    </div>
  );
}

export default CommentsCount;
