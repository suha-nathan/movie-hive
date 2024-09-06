import { fetchMoviesByTitle } from "@/lib/actions/movie.actions";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const searchString = searchParams.get("searchString") || "";

  try {
    const result = await fetchMoviesByTitle({ searchString, pageSize: 5 });
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
