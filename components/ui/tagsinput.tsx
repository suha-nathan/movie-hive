import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const TagsInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const [inputValue, setInputValue] = React.useState<string>("");
    const [tags, setTags] = React.useState<string[]>([]);
    const input = document.getElementById("tags-input");
    const log = document.getElementById("log");

    const logKey = (e: any) => {
      if (e.code === "Enter") {
        tags.push(inputValue);
        setInputValue("");
      }
    };
    const handleInputChange = (event: any) => {
      console.log(event.target.value);
      // setInputValue(event.target.value);
    };

    input?.addEventListener("keydown", logKey);

    // const handleTagsChange = (tags: string[]) => {
    //   console.log(tags);
    //   setTags(tags);
    // };

    return (
      <div>
        <p id="log">
          {tags.map((tag, idx) => (
            <span
              key={`${tag}-${idx}`}
              className="text-light-1 w-auto h-auo p-2"
            >
              {tag}
            </span>
          ))}
        </p>
        <input
          id="tags-input"
          value={inputValue}
          onChange={(event) => handleInputChange(event)}
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);
TagsInput.displayName = "TagsInput";

export { TagsInput };
