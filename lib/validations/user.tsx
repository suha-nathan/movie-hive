import * as z from "zod";

export const userValidation = z.object({
  profile_photo: z.string().url().min(1),
  name: z
    .string()
    .min(3, { message: "minimum 3 char" })
    .max(30, { message: "maximum 30 char" }),
  username: z.string().min(3).max(30),
  bio: z.string().min(3).max(1000),
});
