import { fetchMoviesBySearch } from "@/lib/actions/movie.actions";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const searchString = searchParams.get("searchString") || "";

  try {
    const result = await fetchMoviesBySearch({ searchString });
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
