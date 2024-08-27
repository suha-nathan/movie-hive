"use server";

import { connectToDB } from "../mongoose";
import Review from "../models/review.model";

export async function fetchReviews() {
  try {
    connectToDB();

    const results = await Review.find({}, "_id title text numStars isSpoiler")
      .populate({
        path: "movie",
        select: "_id poster title releaseDate tmdbID",
      })
      .populate({ path: "reviewer", select: "_id username image" })
      .limit(3)
      .exec();

    //TODO: refactor code:
    const reviews = results.map((result) => {
      let obj = {
        _id: result._id.toString(),
        title: result.title,
        text: result.text,
        isSpoiler: result.isSpoiler,
        numStars: result.numStars,
        movie: {
          _id: result.movie._id.toString(),
          tmdbID: result.movie.tmdbID,
          title: result.movie.title,
          poster: result.movie.poster,
          releaseDate: result.movie.releaseDate,
        },
        reviewer: {
          _id: result.reviewer._id.toString(),
          username: result.reviewer.username,
          image: result.reviewer.image,
        },
      };
      return obj;
    });
    return reviews;
  } catch (error: any) {
    console.error("ERROR fetching reviews: ", error.message);
    return [];
  }
}
