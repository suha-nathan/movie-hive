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
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { usePathname, useRouter } from "next/navigation";
import { commentValidation } from "@/lib/validations/comment";
import Image from "next/image";
import { createComment } from "@/lib/actions/comment.actions";

interface Props {
  _id: string;
  image: string;
  postID: string;
  postType: string;
}
const PostComment = ({ _id, image, postID, postType }: Props) => {
  // const router = useRouter();
  // const pathname = usePathname();

  const form = useForm({
    resolver: zodResolver(commentValidation),
    defaultValues: {
      comment: "",
    },
  });
  const onSubmit = async (values: z.infer<typeof commentValidation>) => {
    try {
      const response = await fetch("/api/comment/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: values.comment,
          commenter: _id,
          postID,
          parentComment: null,
          replyToUsername: null,
          replyToUser: null,
          postType,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        console.log("COMMENT SUCCESS", data);
      } else {
        console.error("COMMENT ERROR: ", data.error);
      }
    } catch (error) {
      console.error("ERROR: ", error);
    }
  };
  return (
    <Form {...form}>
      <form
        className="flex flex-row items-center gap-10"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem className="flex w-full flex-row items-center gap-3">
              <FormLabel className="text-base-semibold text-light-2">
                <Image
                  src={image}
                  alt="user_community_image"
                  height={56}
                  width={56}
                  className="cursor-pointer rounded-full"
                />
              </FormLabel>
              <FormControl className="no-focus border border-dark-4 bg-dark-3 text-light-1">
                <Textarea rows={2} {...field} placeholder="Add a Comment" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="bg-primary-500">
          Post Comment
        </Button>
      </form>
    </Form>
  );
};

export default PostComment;
