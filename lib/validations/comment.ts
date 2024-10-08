import * as z from "zod";

export const commentValidation = z.object({
  comment: z.string().min(3, { message: "minimum 3 char" }),
});

export const threadValidation = z.object({
  comment: z.string().min(3, { message: "minimum 3 char" }),
  authorId: z.string(),
});
