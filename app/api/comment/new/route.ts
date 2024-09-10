import { createComment } from "@/lib/actions/comment.actions";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const {
      text,
      commenter,
      postID,
      parentComment,
      replyToUsername,
      replyToUser,
      postType,
      pathname,
    } = await request.json();

    const createdComment = await createComment({
      text,
      commenter,
      parentComment,
      postID,
      replyToUsername,
      replyToUser,
      postType,
      pathname,
    });

    return NextResponse.json({ success: true, comment: createdComment });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
