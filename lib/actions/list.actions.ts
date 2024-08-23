"use server";

import { connectToDB } from "../mongoose";
import List from "../models/list.model";

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
