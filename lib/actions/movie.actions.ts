"use server";

import { connectToDB } from "../mongoose";
import Movie from "../models/movie.model";
import { SortOrder, FilterQuery } from "mongoose";

interface Props {
  tmdbID: number;
  title: string;
  director: string;
  cast: [string];
  description: string;
  poster: string;
  backdrop: string;
  runtime: number;
  genres: [string];
  releaseDate: Date;
}

export async function fetchLatestMovies() {
  try {
    connectToDB();
    const startDate = new Date("2024-07-01"); //TODO: dynamic value
    const endDate = new Date(); //today's Date

    const results = await Movie.find({
      releaseDate: {
        $gte: startDate,
        $lte: endDate,
      },
    }).exec();

    return results;
  } catch (error: any) {
    console.error("ERROR fetching movies: ", error.message);
    return [];
  }
}

export async function fetchMoviesBySearch({
  searchString = "",
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
}: {
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder;
}) {
  try {
    connectToDB();

    if (!searchString) return { movies: [], isNext: false };

    //number of docs to skip based off of page size and num
    const skipAmount = (pageNumber - 1) * pageSize;

    //case insensitive regex of searchString
    const regexQuery = new RegExp(searchString, "i");

    const query: FilterQuery<typeof Movie> = {};

    //if searchString is nonempty, match either username or name
    if (searchString.trim() !== "") {
      query.$or = [
        { username: { $regex: regexQuery } },
        { name: { $regex: regexQuery } },
      ];
    }

    const sortOptions = { releaseDate: sortBy };

    const moviesQuery = Movie.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);

    //count the total number of movies without limit of pagination
    const totalMoviesCount = await Movie.countDocuments(query);
    const movies = await moviesQuery.exec();
    const isNext = totalMoviesCount > skipAmount + movies.length;

    return { movies, isNext };
  } catch (error: any) {
    console.error("ERROR fetching movies: ", error.message);
  }
}
