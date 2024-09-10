"use client";
import Image from "next/image";
import Link from "next/link";
import { formatDateString } from "@/lib/utils";
import { Button } from "../ui/button";
import { TrashIcon } from "@radix-ui/react-icons";
import PostComment from "../forms/PostComment";
import { useState } from "react";
import ReplyCard from "./ReplyCard";

interface Props {
  currentUser: string;
  commentId: string;
  text: string;
  commenter: {
    id: string;
    image: string;
    username: string;
  };
  parentComment: string | null;
  numReplies: number;
  createdAt: Date;
  updatedAt: Date;
  userID: string;
  userImage: string;
  postID: string;
  postType: string;
}

const CommentCard = ({
  currentUser,
  commentId,
  text,
  commenter,
  parentComment,
  numReplies,
  createdAt,
  updatedAt,
  userID,
  userImage,
  postID,
  postType,
}: Props) => {
  const [isRepliesShown, setIsRepliesShown] = useState(false);
  const [isFormShown, setIsFormShown] = useState(false);
  const [replies, setReplies] = useState([]);
  const [taggedUser, setTaggedUser] = useState({ id: "", username: "" });

  const handleReplyClick = () => {
    console.log("handling reply");
    setIsFormShown(!isFormShown);
    setTaggedUser({
      id: commenter.id,
      username: commenter.username,
    });
    if (taggedUser.username)
      document?.getElementById("input-text")?.value = `@${taggedUser.username}`;
  };

  const hideReplies = () => {
    setIsRepliesShown(false);
  };

  const showReplies = async () => {
    try {
      const response = await fetch(`/api/comment/fetch?id=${commentId}`);
      const data = await response.json();
      setIsRepliesShown(true);

      const dataTransform = data.map((comment: any) => {
        return {
          commentId: comment._id,
          text: comment.text,
          commenter: {
            _id: comment.commenter._id,
            image: comment.commenter.image,
            username: comment.commenter.username,
          },
          parentComment: comment.parentComment,
          replyToUsername: comment.replyToUsername,
          replyToUser: comment.replyToUser
            ? {
                _id: comment.replyToUser._id,
                username: comment.replyToUser.username,
              }
            : null,
          createdAt: comment.createdAt,
          updatedAt: comment.updatedAt,
        };
      });

      setReplies(dataTransform);
    } catch (error) {
      console.error("ERROR: fetching replies: ", error);
    }
  };

  return (
    <article className={"flex w-full flex-col rounded-xl bg-dark-2 p-7"}>
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
            <p className="mt-2 text-small-regular text-light-2">{text}</p>

            <div className={`mt-5 flex flex-col gap-3`}>
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
                parentComment={commentId}
                taggedUser={taggedUser}
                setTaggedUser={setTaggedUser}
              />
              {numReplies > 0 && !isRepliesShown && (
                <button onClick={showReplies}>
                  <p className="mt-1 text-subtle-medium text-gray-1">
                    {numReplies} repl{numReplies > 1 ? "ies" : "y"}
                  </p>
                </button>
              )}
              {numReplies > 0 && isRepliesShown && (
                <>
                  {replies.length > 0 &&
                    replies.map((reply: any) => (
                      <ReplyCard
                        key={reply.commentId}
                        currentUser={currentUser}
                        commentId={reply.commentId}
                        text={reply.text}
                        commenter={{
                          id: reply.commenter._id,
                          image: reply.commenter.image,
                          username: reply.commenter.username,
                        }}
                        parentComment={reply.parentComment}
                        replyToUsername={reply.replyToUsername}
                        replyToUser={reply.replyToUser}
                        createdAt={reply.createdAt}
                        updatedAt={reply.updatedAt}
                        userID={userID}
                        userImage={userImage}
                        postID={postID}
                        postType={postType}
                      />
                    ))}
                  <button onClick={hideReplies}>
                    <p className="mt-1 text-subtle-medium text-gray-1">
                      hide repl{numReplies > 1 ? "ies" : "y"}
                    </p>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default CommentCard;
