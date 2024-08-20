import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    tmdbID: Number,
    title: {
      type: String,
      required: true,
    },
    director: String,
    cast: [String],
    description: {
      type: String,
    },
    poster: String,
    backdrop: String,
    runtime: Number,
    genres: [String],
    releaseDate: Date,
  },
  { timestamps: true }
);

const Movie = mongoose.models.Movie || mongoose.model("Movie", movieSchema);

export default Movie;
