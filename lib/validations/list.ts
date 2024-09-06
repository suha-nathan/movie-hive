import * as z from "zod";

export const listValidation = z.object({
  title: z.string().min(3, { message: "minimum 3 char" }),
  description: z.string().min(5, { message: "minimum 5 char" }),
  movies: z.array(z.string()).min(3, "select at least 3 movies"),
});
