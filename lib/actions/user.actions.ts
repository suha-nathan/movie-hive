"use server";

import { connectToDB } from "../mongoose";
import User from "../models/user.model";
import Comment from "../models/comment.model";
import Community from "../models/community.model";
import { revalidatePath } from "next/cache";

interface Params {
  userId: string;
  username: string;
  name: string;
  bio: string;
  image: string;
  path: string;
}

export async function updateUser({
  userId,
  username,
  name,
  bio,
  image,
  path,
}: Params): Promise<void> {
  try {
    connectToDB();

    await User.findOneAndUpdate(
      { id: userId },
      {
        username: username.toLowerCase(),
        name,
        bio,
        path,
        image,
        onboarded: true,
      },
      { upsert: true } //update if doc exists or insert if it doesnt
    );
    if (path === "/profile/edit") {
      revalidatePath(path);
    }
  } catch (error: any) {
    throw new Error(`Failed to create/update user: ${error.message}`);
  }
}

export async function fetchUser(userId: string) {
  try {
    connectToDB();
    const user = await User.findOne({ id: userId });
    // .populate({
    //   path: "communities",
    //   model: "Community",
    // });
    return user;
  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
}

export async function fetchUserComments(userId: string) {
  try {
    connectToDB();
    //get all comments made by userId
    const comments = await User.findOne({ id: userId }).populate({
      path: "comments",
      model: Comment,
      populate: [
        { path: "community", model: Community, select: "name id image _id" },
        {
          path: "children",
          model: Comment,
          populate: { path: "commenter", model: User, select: "name image id" },
        },
      ],
    });
    return comments;
  } catch (error: any) {
    throw new Error(`Failed to fetch user posts: ${error.message}`);
  }
}
