import { NextResponse } from "next/server";
import { fetchReplies } from "@/lib/actions/comment.actions";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const commentId = searchParams.get("id") || "";

  try {
    const result = await fetchReplies(commentId);
    console.log(result);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
