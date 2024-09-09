"use server";

import { connectToDB } from "../mongoose";
import Review from "../models/review.model";
import User from "../models/user.model";
import Comment from "../models/comment.model";

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

export async function fetchReviewsByMovie(movieId: string) {
  try {
    connectToDB();
    const reviews = await Review.find({ movie: movieId })
      .populate({
        path: "reviewer",
        select: "_id username image",
      })
      .sort("desc")
      .limit(2);

    return reviews;
  } catch (error: any) {
    console.error("ERROR fetching reviews: ", error.message);
    return [];
  }
}

export async function fetchReviewByID(id: string) {
  try {
    connectToDB();
    const review = await Review.findById(id)
      .populate({
        path: "reviewer",
        select: "_id username image",
      })
      .populate({
        path: "movie",
        select: "_id tmdbID title releaseDate poster",
      });

    //fetch all top level comments for list
    const comments = await Comment.find({
      post: review._id,
      parentComment: null,
    })
      .populate({
        path: "commenter",
        select: "_id image username",
      })
      .sort({ createdAt: 1 });

    return review;
  } catch (error: any) {
    console.error("ERROR fetching review: ", error.message);
    return {};
  }
}

interface Params {
  title: string;
  text: string;
  dateWatched: Date;
  isSpoiler: boolean;
  tags?: string[] | null;
  movie: string;
  reviewer: string;
  numStars: number;
}

export async function createReview({
  title,
  text,
  dateWatched,
  isSpoiler,
  tags,
  movie,
  reviewer,
  numStars,
}: Params) {
  try {
    connectToDB();
    const createdReview = await Review.create({
      title,
      text,
      dateWatched,
      isSpoiler,
      tags,
      movie,
      reviewer,
      numStars,
    });
    // //update user model with review
    // await User.findByIdAndUpdate(reviewer, {
    //   $push: { reviews: createdReview._id },
    // });

    return createdReview._id.toString();
  } catch (error: any) {
    console.error("ERROR creating review: ", error.message);
    return {};
  }
}
