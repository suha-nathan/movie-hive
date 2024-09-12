import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

//generated by shadcn
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isBase64Image(imageData: string) {
  const base64Regex = /^data:image\/(png|jpe?g|gif|webp);base64,/;
  return base64Regex.test(imageData);
}

export function formatDateString(dateString: string) {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString(undefined, options);

  const time = date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  return `${time} - ${formattedDate}`;
}

interface Props {
  tmdbID: number;
  title: string;
}

export function generateMovieURL(movie: Props) {
  return `${movie.tmdbID}-${movie.title.toLowerCase().split(" ")[0]}`;
}

export function parseMovieURL(url: string) {
  let movieWords = url.split("-");

  return movieWords[0];
}

export function findUsernameMention(
  comment: string,
  username: string
): boolean {
  const regex = new RegExp(`@${username}`, "g");

  return regex.test(comment);
}

export function replaceUsernameMention(
  comment: string,
  username?: string,
  userId?: string
): string {
  if (!username || !userId) return comment;

  const regex = new RegExp(`@${username}`, "g");
  const replacementString = `<a href="/profile/${userId}">@${username}</a>`;
  return comment.replace(regex, replacementString);
}
