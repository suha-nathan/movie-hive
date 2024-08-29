import * as z from "zod";

export const reviewValidation = z.object({
  title: z.string().min(3, { message: "minimum 3 char" }),
  text: z.string().min(5, { message: "minimum 5 char" }),
  dateWatched: z.date({
    required_error: "A watch date is required.",
  }),
  isSpoiler: z.boolean().default(false).optional(),
  //   tags: z.string().array().nonempty({ message: "add a tag!" }),
  numStars: z.string(),
});
