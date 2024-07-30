"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { useRouter } from "next/navigation";

export const Searchbar = ({ routeType }: { routeType: string }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery) {
        router.push(`/${routeType}?q=${searchQuery}`);
      } else {
        router.push(`/${routeType}`);
      }
    }, 300);

    //cleanup function everytime the component (un)mounts
    //ensures only the latest setTimeout is run
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, routeType]);

  return (
    <div className="searchbar">
      <Image
        src="/assets/search-gray.svg"
        alt="search"
        width={24}
        height={24}
        className="object-contain"
      />
      <Input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder={
          routeType !== "/search" ? "Search Communities" : "Search Users"
        }
        className="no-focus searchbar_input"
      />
    </div>
  );
};
