"use server";

import { connectToDB } from "../mongoose";
import Comment from "../models/comment.model";

export async function createComment({
  text,
  commenter,
  parentComment = null,
  postID,
  replyToUsername,
  replyToUser,
  postType,
}: {
  text: string;
  commenter: string;
  parentComment: string | null;
  postID: string;
  replyToUsername?: string;
  replyToUser?: string;
  postType: string;
}) {
  try {
    await connectToDB();

    const createdComment = await Comment.create({
      text,
      commenter,
      parentComment,
      post: postID,
      replyToUsername,
      replyToUser,
      postModel: postType,
    });

    return createdComment;
  } catch (error: any) {
    console.error("ERROR creating review: ", error.message);
    return {};
  }
}

export async function fetchTopLevelComments(postId: string) {
  try {
    await connectToDB();

    const comments = await Comment.find({
      post: postId,
      parentComment: null,
    })
      .populate({
        path: "commenter",
        select: "_id image username",
      })
      .populate({
        path: "replyToUser",
        select: "_id image username",
      })
      .sort({ createdAt: 1 });

    const commentsWithReplyNum = await Promise.all(
      comments.map(async (comment) => {
        const numReplies = await Comment.countDocuments({
          parentComment: comment._id,
        });
        return {
          ...comment.toObject(),
          numReplies,
        };
      })
    );

    return commentsWithReplyNum;
  } catch (error: any) {
    console.error("ERROR fetching comments: ", error.message);
    return [];
  }
}

export async function fetchReplies(commentId: string) {
  try {
    await connectToDB();

    const comments = await Comment.find({ parentComment: commentId })
      .populate({
        path: "commenter",
        select: "_id image username",
      })
      .populate({
        path: "replyToUser",
        select: "_id image username",
      })
      .sort({ createdAt: 1 });

    return comments;
  } catch (error: any) {
    console.error("ERROR fetching comments: ", error.message);
    return [];
  }
}
