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
