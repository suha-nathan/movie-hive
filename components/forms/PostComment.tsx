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
import { findUsernameMention } from "@/lib/utils";
import { useEffect, useState } from "react";

interface Props {
  userID: string;
  image: string;
  postID: string;
  postType: string;
  isFormShown: boolean;
  setIsFormShown?: React.Dispatch<React.SetStateAction<boolean>>;
  parentComment?: string;
  taggedUser?: {
    id: string;
    username: string;
  };
  setTaggedUser?: React.Dispatch<
    React.SetStateAction<{
      id: string;
      username: string;
    }>
  >;
}
const PostComment = ({
  userID,
  image,
  postID,
  postType,
  isFormShown,
  setIsFormShown,
  parentComment,
  taggedUser,
  setTaggedUser,
}: Props) => {
  // const router = useRouter();
  const pathname = usePathname();

  const [username, setUsername] = useState(taggedUser?.username || "");

  const form = useForm({
    resolver: zodResolver(commentValidation),
    defaultValues: {
      comment: "",
    },
  });

  useEffect(() => {
    if (taggedUser && taggedUser.username) {
      form.setValue("comment", `@${taggedUser.username}`);
    }
  }, [taggedUser]);

  const handleCancel = () => {
    if (setIsFormShown) setIsFormShown(false);
    form.setValue("comment", "");
    if (setTaggedUser) {
      setTaggedUser({
        id: "",
        username: "",
      });
    }
  };
  const onSubmit = async (values: z.infer<typeof commentValidation>) => {
    try {
      let formData = {
        text: values.comment,
        commenter: userID,
        postID,
        parentComment: parentComment ? parentComment : null,
        replyToUsername:
          taggedUser && taggedUser.username ? taggedUser.username : null,
        replyToUser: taggedUser && taggedUser.id ? taggedUser.id : null,
        postType,
        pathname,
      };

      // remove tagged user if "@username" is removed from text
      if (
        taggedUser &&
        setTaggedUser &&
        !findUsernameMention(values.comment, taggedUser.username)
      ) {
        setTaggedUser({
          id: "",
          username: "",
        });
        formData.replyToUsername = null;
        formData.replyToUser = null;
      }

      const response = await fetch("/api/comment/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
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
        className={`flex flex-row items-center gap-5 ${
          !isFormShown && "hidden"
        }`}
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
                <Textarea
                  rows={2}
                  {...field}
                  placeholder="Add a Comment"
                  id="input-text"
                />
              </FormControl>
              {/* <FormMessage /> */}
            </FormItem>
          )}
        />
        {setIsFormShown && (
          <Button className="bg-secondary-500" onClick={() => handleCancel()}>
            Cancel
          </Button>
        )}
        <Button type="submit" className="bg-primary-500">
          Post Comment
        </Button>
      </form>
    </Form>
  );
};

export default PostComment;
