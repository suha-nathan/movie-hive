"use client";
import { useState, KeyboardEvent } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { usePathname, useRouter } from "next/navigation";
import { listValidation } from "@/lib/validations/list";
import { createList } from "@/lib/actions/list.actions";

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
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `/api/movies/search?searchString=${searchString}`
      );
      const data = await response.json();
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
  const handleInputKeyDown = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchString) {
      e.preventDefault();
      await handleSearch();
      setIsPopoverOpen(true);
    }
  };

  type FormValues = {
    title: string;
    description: string;
    movies: { _id: string; poster: string; title: string }[];
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

  const handleAddMovie = (movie: MovieProps) => {
    append({ _id: movie._id, poster: movie.poster, title: movie.title });
    setSearchResults([]);
    setIsPopoverOpen(false);
  };

  const onSubmit = async (values: z.infer<typeof listValidation>) => {
    const movieIds = values.movies.map((movie) => movie._id);
    const newListID = await createList({
      ...values,
      movies: movieIds,
      creator: userId,
    });

    router.push(`/lists/${newListID}`);
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
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger asChild>
            <Input
              type="text"
              className="account-form_input no-focus"
              onChange={(e) => setSearchString(e.target.value)}
              placeholder="Search for Movies..."
              onKeyDown={handleInputKeyDown}
            />
          </PopoverTrigger>
          <PopoverContent className="w-[400px] p-4">
            <h3 className="font-medium mb-2">
              Search Results for: {searchString}
            </h3>
            {searchResults.length > 0 ? (
              <div className="flex flex-row gap-2 flex-wrap">
                {searchResults.map((movie) => (
                  <div key={movie._id}>
                    <button
                      type="button"
                      onClick={() => handleAddMovie(movie)}
                      className=""
                    >
                      <img
                        src={movie.poster}
                        alt={movie.title}
                        height={80}
                        width={80}
                      />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p>No results found. Try a different search term.</p>
            )}
          </PopoverContent>
        </Popover>

        <h2 className="text-light-1">Selected Movies</h2>
        <div className="h-32 flex flex-row">
          {fields.map((field, index) => (
            <div key={field._id} className="relative p-2">
              <input
                type="hidden"
                {...register(`movies.${index}`)}
                defaultValue={field.id}
              />
              <img
                src={field.poster}
                alt={field.title}
                className="h-32 w-auto object-cover"
              />
              <button
                type="button"
                onClick={() => remove(index)}
                className="absolute top-0 right-0 bg-red-700 text-white p-1 text-xs"
              >
                X
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
