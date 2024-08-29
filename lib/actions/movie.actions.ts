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
//TODO: Refactor fetchLatest and fetchAll. figure out method to deal with _id

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
    const movies = results.map((movie) => ({
      _id: movie._id.toString(),
      title: movie.title,
      tmdbID: movie.tmdbID,
      releaseDate: movie.releaseDate,
      poster: movie.poster,
    }));
    return movies;
  } catch (error: any) {
    console.error("ERROR fetching movies: ", error.message);
    return [];
  }
}

export async function fetchAll() {
  try {
    connectToDB();

    const results = await Movie.find({}, "_id title");

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

    //if searchString is nonempty, match movie title
    if (searchString.trim() !== "") {
      query.$or = [
        { title: { $regex: regexQuery } },
        { director: { $regex: regexQuery } },
        { genres: { $regex: regexQuery } },
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
    return { movies: [], isNext: false };
  }
}

export async function fetchMovieByID(id: string) {
  try {
    connectToDB();
    const result = await Movie.find({ tmdbID: id });

    return result[0];
  } catch (error: any) {
    console.error("ERROR fetching movie: ", error.message);
    return {};
  }
}
