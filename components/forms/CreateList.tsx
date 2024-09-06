"use client";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { usePathname, useRouter } from "next/navigation";
import { listValidation } from "@/lib/validations/list";

interface MovieProps {
  _id: string;
  poster: string;
  title: string;
}

const CreateList = ({
  userId,
  className,
}: {
  userId: string;
  className: string;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [searchResults, setSearchResults] = useState<MovieProps[]>([]);
  const [searchString, setSearchString] = useState("");

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `/api/movies/search?searchString=${searchString}`
      );
      const data = await response.json();
      console.log("API DATA: ", data);
      setSearchResults(
        data.movies.map((movie: any) => ({
          _id: movie._id.toString(),
          poster: movie.poster,
          title: movie.title,
        }))
      );
    } catch (error) {
      console.error("ERROR: fetching movies: ", error);
    }
  };

  type FormValues = {
    title: string;
    description: string;
    movies: string[];
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(listValidation),
    defaultValues: {
      title: "",
      description: "",
      movies: [],
    },
  });

  const { control, handleSubmit, register } = form;

  const { fields, append, remove } = useFieldArray({ control, name: "movies" });

  const onSubmit = async (values: z.infer<typeof listValidation>) => {
    console.log("FORM DATA: ", values);

    // const newReviewID = await createReview({
    //   title: values.title,
    //   text: values.text,
    //   tags: tags,
    //   dateWatched: values.dateWatched,
    //   isSpoiler: values.isSpoiler,
    //   numStars: Number(values.numStars),
    //   movie: movieId,
    //   reviewer: userId,
    // });
    // router.push(`/review/${newReviewID}`);
  };
  return (
    <Form {...form}>
      <form
        className={`flex flex-col justify-start gap-10 ${className}`}
        onSubmit={handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-3 w-full">
              <FormLabel className="text-base-semibold text-light-1">
                Title
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  className="account-form_input no-focus"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-3">
              <FormLabel className="text-base-semibold text-light-1">
                Description
              </FormLabel>
              <FormControl className="no-focus border border-dark-4 bg-dark-3 text-light-1">
                <Textarea rows={5} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Input
          type="text"
          className="account-form_input no-focus"
          onChange={(e) => setSearchString(e.target.value)}
          placeholder="Search for Movies..."
        />
        <button className="bg-green-700 text-light-1" onClick={handleSearch}>
          Search
        </button>
        <h2 className="text">Searched Movies</h2>
        <div className="h-32 flex flex-row gap-2">
          {searchResults.map((movie) => (
            <div key={movie._id}>
              <img
                src={movie.poster}
                alt={movie.title}
                height={100}
                width={100}
              />
              <button
                type="button"
                onClick={() => append(movie._id)}
                className="text-light-1 bg-green-700 p-2 text-subtle-medium"
              >
                Add {movie.title}
              </button>
            </div>
          ))}
        </div>
        <h2 className="text-light-1">Selected Movies</h2>
        <div className="h-32 flex flex-row">
          {/* Display selected movies */}
          {fields.map((field, index) => (
            <div key={field.id}>
              <input
                type="hidden"
                {...register(`movies.${index}`)}
                defaultValue={field.id}
              />
              <p className="text-light-1">Movie ID: {field.id}</p>
              <button
                type="button"
                onClick={() => remove(index)}
                className="text-light-1 bg-red-700 p-2 text-subtle-medium"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <Button type="submit" className="bg-primary-500 hover:bg-slate-500">
          Publish List
        </Button>
      </form>
    </Form>
  );
};

export default CreateList;
