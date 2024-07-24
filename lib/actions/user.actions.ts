"use server";

import { connectToDB } from "../mongoose";
import User from "../models/user.model";

export async function updateUser(
  userId: string,
  username: string,
  name: string,
  bio: string,
  path: string
): Promise<void> {
  await connectToDB();
  await User.findOneAndUpdate(
    { id: userId },
    {
      username: username.toLowerCase(),
      name,
      bio,
      path,
      onboarded: true,
    },
    { upsert: true } //update if doc exists or insert if it doesnt
  );
}
