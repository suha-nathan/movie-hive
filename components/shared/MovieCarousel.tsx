"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import MovieCard from "../cards/MovieCard";

import React from "react";

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

interface MovieProps {
  movies: Props[];
}

function MovieCarousel({ movies }: MovieProps) {
  return (
    <Carousel className="w-full max-w-xs">
      <CarouselContent>
        {movies.map((movie) => (
          <CarouselItem key={movie.tmdbID}>
            <div className="p-1">
              {/* <Card> */}
              {/* <CardContent className="flex aspect-square items-center justify-center p-6"> */}
              <MovieCard {...movie} />
              {/* </CardContent> */}
              {/* </Card> */}
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}

export default MovieCarousel;
