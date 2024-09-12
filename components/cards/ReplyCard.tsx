"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { TrashIcon } from "@radix-ui/react-icons";
import PostComment from "../forms/PostComment";

interface Props {
  currentUser: string;
  commentId: string;
  text: string;
  commenter: {
    id: string;
    image: string;
    username: string;
  };
  parentComment: string;
  replyToUsername?: string;
  replyToUser?: {
    _id: string;
    username: string;
  };
  createdAt: Date;
  updatedAt: Date;
  userID: string;
  userImage: string;
  postID: string;
  postType: string;
}

function ReplyCard({
  currentUser,
  commentId,
  text,
  commenter,
  parentComment,
  replyToUsername,
  replyToUser,
  createdAt,
  updatedAt,
  userID,
  userImage,
  postID,
  postType,
}: Props) {
  const [isFormShown, setIsFormShown] = useState(false);
  const [taggedUser, setTaggedUser] = useState({ id: "", username: "" });

  const handleReplyClick = () => {
    console.log("handling replyCard reply");
    setIsFormShown(!isFormShown);
    setTaggedUser({
      id: commenter.id,
      username: commenter.username,
    });
  };

  function replaceUsernameMention(
    comment: string,
    username?: string,
    userId?: string
  ): (string | JSX.Element)[] {
    if (!username || !userId) return [comment];

    const parts = comment.split(new RegExp(`@${username}`, "g"));

    console.log(parts);
    return parts.map((part, index) =>
      part === `@${username}` ? (
        <a key={index} href={`/profile/${userId}`} className="text-link">
          {part}
        </a>
      ) : (
        part
      )
    );
  }

  return (
    <article className={"flex w-full flex-col rounded-xl px-0 xs:px-7"}>
      <div className="flex items-start justify-between">
        <div className="flex w-full flex-1 flex-row gap-4">
          <div className="flex flex-col items-center">
            <Link
              href={`/profile/${commenter.id}`}
              className="relative h-11 w-11"
            >
              <Image
                src={commenter.image}
                alt="user_image"
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
            <p className="mt-2 text-small-regular text-light-2">
              {replaceUsernameMention(text, replyToUsername, replyToUser?._id)}
            </p>

            <div
              className={`${parentComment && "mb-10"} mt-5 flex flex-col gap-3`}
            >
              <div className="flex gap-3.5">
                <Image
                  src="/assets/heart-gray.svg"
                  alt="like"
                  width={24}
                  height={24}
                  className="cursor-pointer object-contain"
                />
                <button onClick={handleReplyClick}>
                  <Image
                    src="/assets/reply.svg"
                    alt="reply"
                    width={24}
                    height={24}
                    className="cursor-pointer object-contain"
                  />
                </button>
                {/* delete and edit function only for same user */}
                {currentUser === commenter.id && (
                  <TrashIcon
                    color="#5C5C7B"
                    width={24}
                    height={24}
                    className="cursor-pointer object-contain"
                  />
                )}
                {currentUser === commenter.id && (
                  <Image
                    src="/assets/edit.svg"
                    alt="edit"
                    width={24}
                    height={24}
                    className="cursor-pointer object-contain"
                  />
                )}
              </div>
              <PostComment
                userID={userID}
                image={userImage}
                postID={postID}
                postType={postType}
                isFormShown={isFormShown}
                setIsFormShown={setIsFormShown}
                parentComment={parentComment}
                taggedUser={taggedUser}
                setTaggedUser={setTaggedUser}
              />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default ReplyCard;
