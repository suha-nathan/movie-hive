"use client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import TagsInput from "../shared/TagsInput";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "../ui/checkbox";
import { Calendar } from "../ui/calendar";
import { CalendarIcon } from "@radix-ui/react-icons";

import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { usePathname, useRouter } from "next/navigation";
import { reviewValidation } from "@/lib/validations/review";
import { createReview } from "@/lib/actions/review.action";

const CreateReview = ({
  userId,
  movieId,
}: {
  userId: string;
  movieId: string;
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const form = useForm({
    resolver: zodResolver(reviewValidation),
    defaultValues: {
      title: "",
      text: "",
      tags: [],
      dateWatched: new Date(),
      isSpoiler: false,
      numStars: "1",
    },
  });
  const onSubmit = async (values: z.infer<typeof reviewValidation>) => {
    console.log("VALUES: ", values);
    // TODO: implement tags
    const newReviewID = await createReview({
      title: values.title,
      text: values.text,
      dateWatched: values.dateWatched,
      isSpoiler: values.isSpoiler ? values.isSpoiler : false,
      numStars: Number(values.numStars),
      movie: movieId,
      reviewer: userId,
    });
    router.push(`/review/${newReviewID}`);
  };
  return (
    <Form {...form}>
      <form
        className="mt-10 flex flex-col justify-start gap-10"
        onSubmit={form.handleSubmit(onSubmit)}
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
          name="text"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-3">
              <FormLabel className="text-base-semibold text-light-1">
                Content
              </FormLabel>
              <FormControl className="no-focus border border-dark-4 bg-dark-3 text-light-1">
                <Textarea rows={5} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isSpoiler"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 account-form_input">
              <FormControl>
                <Checkbox
                  className="border border-light-1"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="text-light-1">
                does your review contain spoilers?
              </FormLabel>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dateWatched"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="text-base-semibold text-light-1">
                Date Watched
              </FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal border border-dark-4 bg-dark-3 text-light-1",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 " align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="numStars"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-3 w-full">
              <FormLabel className="text-base-semibold text-light-1">
                Rating
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  max={5}
                  className="account-form_input no-focus"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div id="calendar-pose"></div>
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-3 w-full ">
              <FormLabel className="text-base-semibold text-light-1 ">
                Tags
              </FormLabel>
              <FormControl>
                <TagsInput
                  type="text"
                  className="account-form_input no-focus"
                  // {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="bg-primary-500 hover:bg-slate-500">
          Create Review
        </Button>
      </form>
    </Form>
  );
};

export default CreateReview;
