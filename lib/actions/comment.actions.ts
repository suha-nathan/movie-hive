"use server";
import { connectToDB } from "../mongoose";
import Comment from "../models/comment.model";
import Community from "../models/community.model";
import { revalidatePath } from "next/cache";
import User from "../models/user.model";

interface Params {
  text: string;
  commenter: string;
  communityId: string | null;
  path: string;
}

export async function createComment({
  text,
  commenter,
  communityId,
  path,
}: Params) {
  try {
    connectToDB();

    //find the community _id from community -> mongodb _id from clerk organization id
    const communityIdObject = await Community.findOne(
      { id: communityId },
      { _id: 1 }
    );

    const createdComment = await Comment.create({
      text,
      commenter,
      community: communityIdObject,
    });

    //update user model
    await User.findByIdAndUpdate(commenter, {
      $push: { comments: createdComment._id },
    });

    if (communityIdObject) {
      // Update Community model
      await Community.findByIdAndUpdate(communityIdObject, {
        $push: { comments: createdComment._id },
      });
    }

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Unable to create comment: ${error}`);
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
        path: "community",
        model: Community,
      })
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
    const comment = await Comment.findById(commentId)
      .populate({
        path: "commenter",
        model: User,
        select: "_id id name image",
      })
      .populate({
        path: "community",
        model: Community,
      })
      .populate({
        path: "children",
        populate: [
          {
            path: "commenter",
            model: User,
            select: "_id id name parentId image",
          },
          {
            path: "children",
            model: Comment,
            populate: {
              path: "commenter",
              model: User,
              select: "_id id name parentId image",
            },
          },
        ],
      })
      .exec();
    return comment;
  } catch (error: any) {
    throw new Error(`Failed to fetch comment: ${error.message}`);
  }
}

export async function addCommentToThread(
  commentId: string,
  commentText: string,
  userId: string,
  path: string
) {
  try {
    connectToDB();
    //find original comment by its ID
    const originalComment = await Comment.findById(commentId);
    if (!originalComment) throw new Error("Comment Not Found");

    //create a new comment and set the parent ID to the original comment's ID
    const newComment = new Comment({
      text: commentText,
      commenter: userId,
      parentId: commentId,
    });
    //save the new comment to the database
    const savedComment = await newComment.save();

    //add new comment ID to the original comment's children array
    originalComment.children.push(savedComment._id);

    //save the updated original comment to the database
    await originalComment.save();

    revalidatePath(path);
  } catch (error: any) {
    console.error("Error occurred:", error.message);
    throw new Error(`Error while adding comment: ${error.message}`);
  }
}

async function fetchAllChildComments(commentId: string): Promise<any[]> {
  const childComments = await Comment.find({ parentId: commentId });
  const descendantComments = [];

  for (const childComment of childComments) {
    const descendants = await fetchAllChildComments(childComment._id);
    descendantComments.push(descendants);
  }
  return descendantComments;
}

export async function deleteComment(id: string, path: string): Promise<void> {
  try {
    connectToDB();

    //find the main comment to be deleted
    const mainComment = await Comment.findById(id).populate("author community");
    if (!mainComment) throw new Error("Comment Not Found");

    //fetch all child comments and their descendants recursively
    const descendantComments = await fetchAllChildComments(id);

    //gather all the comment Ids including the main comment and all child thread IDs
    const descendantCommentIds = [
      id,
      ...descendantComments.map((comment) => comment._id),
    ];

    //extract unique commenterIds and communityIds to update User and Comminoty models
    const uniqueCommenterIds = new Set(
      [
        ...descendantComments.map((comment) =>
          comment.commenter?._id?.toString()
        ), // Use optional chaining to handle possible undefined values
        mainComment.commenter?._id?.toString(),
      ].filter((id) => id !== undefined)
    );

    const uniqueCommunityIds = new Set(
      [
        ...descendantComments.map((comment) =>
          comment.community?._id?.toString()
        ), // Use optional chaining to handle possible undefined values
        mainComment.community?._id?.toString(),
      ].filter((id) => id !== undefined)
    );

    //recursively delete child comments and their descendants
    await Comment.deleteMany({ _id: { $in: descendantCommentIds } });

    //update User Model
    await User.updateMany(
      { _id: { $in: Array.from(uniqueCommenterIds) } },
      { $pull: { comments: { $in: descendantCommentIds } } }
    );

    //update Community Model
    await Community.updateMany(
      { _id: { $in: Array.from(uniqueCommunityIds) } },
      { $pull: { comments: { $in: descendantCommentIds } } }
    );

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to delete thread: ${error.message}`);
  }
}
