"use client";
import Image from "next/image";
import Link from "next/link";
import DeleteComment from "../forms/DeleteComment";
import { formatDateString } from "@/lib/utils";
import { Button } from "../ui/button";

interface Props {
  id: string;
  text: string;
  commenter: {
    id: string;
    image: string;
    username: string;
  };
  parentComment: string | null;
  replyToUsername?: string;
  replyToUser?: string;
  numReplies: number;
  createdAt: Date;
  updatedAt: Date;
}

const CommentCard = ({
  id,
  text,
  commenter,
  parentComment,
  replyToUsername,
  replyToUser,
  numReplies,
}: Props) => {
  const handleReplyClick = () => {
    console.log("handling reply");
  };
  const showReplies = () => {
    console.log("handling reply");
  };

  return (
    <article
      className={`flex w-full flex-col rounded-xl
    ${parentComment ? "px-0 xs:px-7" : "bg-dark-2 p-7"}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex w-full flex-1 flex-row gap-4">
          <div className="flex flex-col items-center">
            <Link
              href={`/profile/${commenter.id}`}
              className="relative h-11 w-11"
            >
              <Image
                src={commenter.image}
                alt="user_community_image"
                fill
                className="cursor-pointer rounded-full"
              />
            </Link>
            <div className="thread-card_bar" />
          </div>
          <div className="flex w-full flex-col">
            <Link href={`/profile/${commenter.id}`} className="w-fit">
              <h4 className="cursor-pointer text-base-semibold text-light-1">
                {commenter.username}
              </h4>
            </Link>
            <p className="mt-2 text-small-regular text-light-2">{text}</p>

            <div
              className={`${parentComment && "mb-10"} mt-5 flex flex-col gap-3`}
            >
              <div className="flex gap-3.5">
                <Image
                  src="/assets/heart-gray.svg"
                  alt="heart"
                  width={24}
                  height={24}
                  className="cursor-pointer object-contain"
                />
                <Button className="bg-none" onClick={handleReplyClick}>
                  <Image
                    src="/assets/reply.svg"
                    alt="reply"
                    width={24}
                    height={24}
                    className="cursor-pointer object-contain"
                  />
                </Button>

                {/* <Image
                  src="/assets/repost.svg"
                  alt="heart"
                  width={24}
                  height={24}
                  className="cursor-pointer object-contain"
                />
                <Image
                  src="/assets/share.svg"
                  alt="heart"
                  width={24}
                  height={24}
                  className="cursor-pointer object-contain"
                /> */}
              </div>
              {!parentComment && numReplies > 0 && (
                <Button onClick={showReplies}>
                  <p className="mt-1 text-subtle-medium text-gray-1">
                    {numReplies} repl{numReplies > 1 ? "ies" : "y"}
                  </p>
                </Button>
              )}
            </div>
          </div>
        </div>
        <DeleteComment />
      </div>
    </article>
  );
};

export default CommentCard;
