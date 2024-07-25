"use server";

import { connectToDB } from "../mongoose";
import Comment from "../models/comment.model";
import { revalidatePath } from "next/cache";
import User from "../models/user.model";

interface Params {
  text: string;
  commenter: string;
  community: string | null;
  path: string;
}

export async function createComment({
  text,
  commenter,
  community,
  path,
}: Params) {
  try {
    connectToDB();
    const createdComment = await Comment.create({
      text,
      commenter,
      community: null,
    });

    //update user model
    await User.findByIdAndUpdate(commenter, {
      $push: { comments: createdComment._id },
    });
    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Unable to create comment: ${error.message}`);
  }
}

export async function fetchComments(pageNumber = 1, pageSize = 20) {
  try {
    connectToDB();
    //calculate number of posts to skip
    const skipAmount = (pageNumber - 1) * pageSize;

    //fetch comments that have no parents i.e. top level threads
    const commentsQuery = Comment.find({
      parentId: { $in: [null, undefined] },
    })
      .sort({ createdAt: "desc" })
      .skip(skipAmount)
      .limit(pageSize)
      .populate({ path: "commenter", model: User })
      .populate({
        path: "children",
        populate: {
          path: "commenter",
          model: User,
          select: "_id name image",
        },
      });
    const totalCommentsCount = await Comment.countDocuments({
      parentId: { $in: [null, undefined] },
    });

    const comments = await commentsQuery.exec();
    const isNext = totalCommentsCount > skipAmount + comments.length;
    return { comments, isNext };
  } catch (error: any) {
    throw new Error(`Failed to fetch comments: ${error.message}`);
  }
}

export async function fetchCommentById(commentId: string) {
  try {
    connectToDB();
  } catch (error: any) {
    throw new Error(`Failed to fetch comment: ${error.message}`);
  }
}
