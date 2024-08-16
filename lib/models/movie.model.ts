import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
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
    releaseDate: String,
  },
  { timestamps: true }
);

const Movie = mongoose.models.Movie || mongoose.model("Movie", movieSchema);

export default Movie;

/*
//TMDB Movie Detail
let movie = {
  adult: false,
  backdrop_path: "/lgkPzcOSnTvjeMnuFzozRO5HHw1.jpg",
  belongs_to_collection: {
    id: 86066,
    name: "Despicable Me Collection",
    poster_path: "/95prV91f4DxkBnLU43YjLbU1m3q.jpg",
    backdrop_path: "/37xamYKRUGCRux532lKcZdVGYuR.jpg",
  },
  budget: 100000000,
  genres: [
    {
      id: 16,
      name: "Animation",
    },
    {
      id: 10751,
      name: "Family",
    },
    {
      id: 35,
      name: "Comedy",
    },
    {
      id: 28,
      name: "Action",
    },
  ],
  homepage: "https://www.despicable.me",
  id: 519182,
  imdb_id: "tt7510222",
  origin_country: ["US"],
  original_language: "en",
  original_title: "Despicable Me 4",
  overview:
    "Gru and Lucy and their girls—Margo, Edith and Agnes—welcome a new member to the Gru family, Gru Jr., who is intent on tormenting his dad. Gru also faces a new nemesis in Maxime Le Mal and his femme fatale girlfriend Valentina, forcing the family to go on the run.",
  popularity: 2739.442,
  poster_path: "/wWba3TaojhK7NdycRhoQpsG0FaH.jpg",
  production_companies: [
    {
      id: 33,
      logo_path: "/8lvHyhjr8oUKOOy2dKXoALWKdp0.png",
      name: "Universal Pictures",
      origin_country: "US",
    },
    {
      id: 6704,
      logo_path: "/fOG2oY4m1YuYTQh4bMqqZkmgOAI.png",
      name: "Illumination",
      origin_country: "US",
    },
  ],
  production_countries: [
    {
      iso_3166_1: "US",
      name: "United States of America",
    },
  ],
  release_date: "2024-06-20",
  revenue: 810329715,
  runtime: 94,
  spoken_languages: [
    {
      english_name: "English",
      iso_639_1: "en",
      name: "English",
    },
  ],
  status: "Released",
  tagline: "Things just got a little more despicable.",
  title: "Despicable Me 4",
  video: false,
  vote_average: 7.354,
  vote_count: 1014,
};

//TMDB Cast Detail

let crew: any = {
  id: 51982,
  cast: [
    {
      adult: false,
      gender: 2,
      id: 4495,
      known_for_department: "Acting",
      name: "Steve Carell",
      original_name: "Steve Carell",
      popularity: 35.795,
      profile_path: "/dA6n0qpnlMFBlTr8SBULsZbWkvn.jpg",
      cast_id: 6,
      character: "Gru (voice)",
      credit_id: "62101d6cd100b600419a339e",
      order: 0,
    },
    {
      adult: false,
      gender: 1,
      id: 41091,
      known_for_department: "Acting",
      name: "Kristen Wiig",
      original_name: "Kristen Wiig",
      popularity: 27.274,
      profile_path: "/p4QYkJ7EboyhzQcexH86SgCOki7.jpg",
      cast_id: 11,
      character: "Lucy (voice)",
      credit_id: "62102273e0ca7f00436fab9d",
      order: 1,
    },
  ],
  crew: [
    {
      adult: false,
      gender: 2,
      id: 124748,
      known_for_department: "Acting",
      name: "Chris Renaud",
      original_name: "Chris Renaud",
      popularity: 9.94,
      profile_path: "/sumBJgBqRkK4XEJ2JYXpad3MTJs.jpg",
      credit_id: "62101ce6e72fe80043b24690",
      department: "Directing",
      job: "Director",
    },
    {
      adult: false,
      gender: 2,
      id: 1498226,
      known_for_department: "Visual Effects",
      name: "Patrick Delage",
      original_name: "Patrick Delage",
      popularity: 1.778,
      profile_path: null,
      credit_id: "62101d07d100b600419a327a",
      department: "Directing",
      job: "Co-Director",
    },
  ],
};
*/
