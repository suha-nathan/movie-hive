"use server";

import { connectToDB } from "../mongoose";
import List from "../models/list.model";
import { SortOrder, FilterQuery } from "mongoose";

export async function fetchLists() {
  try {
    connectToDB();

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
    connectToDB();

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
          ],
        },
      },
      // Pagination stages
      { $skip: skipAmount },
      { $limit: pageSize },
    ]);

    //count the total number of movies without limit of pagination
    const totalMoviesCount = await List.countDocuments({
      $or: [
        { title: { $regex: regexQuery } },
        { description: { $regex: regexQuery } },
        { "creatorDetails.username": { $regex: regexQuery } },
        { "movieDetails.title": { $regex: regexQuery } },
      ],
    });

    const isNext = totalMoviesCount > skipAmount + lists.length;

    return { lists, isNext };
  } catch (error: any) {
    console.error("ERROR fetching lists: ", error.message);
    return { lists:[], isNext: false };
  }
}
