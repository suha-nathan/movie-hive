"use server";

import { connectToDB } from "../mongoose";
import List from "../models/list.model";
import User from "../models/user.model";
import { SortOrder, FilterQuery } from "mongoose";

export async function fetchLists() {
  try {
    await connectToDB();

    const results = await List.find({})
      .populate({ path: "movies", select: "poster title releaseDate" })
      .populate({ path: "creator", select: "_id username image" })
      .limit(3)
      .exec();

    return results;
  } catch (error: any) {
    console.error("ERROR fetching lists: ", error.message);
    return [];
  }
}

// TODO: order of results changes need to fix
export async function fetchListsBySearch({
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
    await connectToDB();

    if (!searchString) return { lists: [], isNext: false };

    //number of docs to skip based off of page size and num
    const skipAmount = (pageNumber - 1) * pageSize;
    const regexQuery = new RegExp(searchString, "i");

    //aggregation pipeline
    const lists = await List.aggregate([
      {
        $lookup: {
          from: "users", // The collection name of users in MongoDB
          localField: "creator",
          foreignField: "_id",
          as: "creatorDetails",
        },
      },
      // Lookup for movies to match by title
      {
        $lookup: {
          from: "movies", // The collection name of movies in MongoDB
          localField: "movies",
          foreignField: "_id",
          as: "movieDetails",
        },
      },
      // Match stage
      {
        $match: {
          $or: [
            { title: { $regex: regexQuery } },
            { description: { $regex: regexQuery } },
            { "creatorDetails.username": { $regex: regexQuery } },
            { "movieDetails.title": { $regex: regexQuery } },
            { "movieDetails.genre": { $regex: regexQuery } },
          ],
        },
      },
      // Pagination stages
      { $skip: skipAmount },
      { $limit: pageSize },
    ]).exec();

    //remove unnecessary fields and flatten creatorDetails array
    const reshapedLists = lists.map((list) => ({
      ...list,
      creator: list.creatorDetails[0], // Flatten array to single object
      movies: list.movieDetails.map((movie: any) => ({ poster: movie.poster })), // filter only the poster field
    }));

    // Clean up unnecessary fields
    reshapedLists.forEach((list) => {
      delete list.creatorDetails;
      delete list.movieDetails;
    });

    //count the total number of Lists without limit of pagination
    const totalListsCount = await List.countDocuments({
      $or: [
        { title: { $regex: regexQuery } },
        { description: { $regex: regexQuery } },
        { "creatorDetails.username": { $regex: regexQuery } },
        { "movieDetails.title": { $regex: regexQuery } },
        { "movieDetails.genre": { $regex: regexQuery } },
      ],
    });

    const isNext = totalListsCount > skipAmount + lists.length;

    return { lists: reshapedLists, isNext };
  } catch (error: any) {
    console.error("ERROR fetching lists: ", error.message);
    return { lists: [], isNext: false };
  }
}

export async function fetchListByID(id: string) {
  try {
    await connectToDB();

    const result = await List.findById(id)
      .populate({ path: "movies", select: "poster tmdbID title releaseDate" })
      .populate({ path: "creator", select: "_id username image" })
      .populate("comments");

    return result;
  } catch (error: any) {
    console.error("ERROR fetching lists: ", error.message);
    return [];
  }
}

export async function createList({
  title,
  description,
  movies,
  creator,
}: {
  title: string;
  description: string;
  movies: string[];
  creator: string;
}) {
  try {
    await connectToDB();

    const createdList = await List.create({
      title,
      description,
      creator,
      movies,
    });

    //update user model with new list
    await User.findByIdAndUpdate(creator, {
      $push: { lists: createdList._id },
    });

    return createdList._id.toString();
  } catch (error: any) {
    console.error("ERROR creating review: ", error.message);
    return {};
  }
}
