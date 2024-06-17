"use client";

import { Search } from "lucide-react";
import React, { FC, Suspense, useEffect, useState } from "react";
import { Input } from "./ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";

interface SearchInputProps {}
const SearchInput: FC<SearchInputProps> = ({}) => {
  const [value, setValue] = useState("");
  const debouncedValue = useDebounce(value);

  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategoryId = searchParams.get("categoryId");
  useEffect(() => {
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          categoryId: currentCategoryId,
          title: debouncedValue,
        },
      },
      { skipEmptyString: true, skipNull: true }
    );
    router.push(url);
  }, [debouncedValue, router, currentCategoryId, pathname]);
  return (
    <div className=" relative">
      <Search className=" h-4 size-4 absolute top-3 left-3 text-slate-600" />
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className=" w-full md:w-[300px] pl-9 rounded-full bg-slate-100 focus-visible:ring-slate-200"
        placeholder="Search for courses"
      />
    </div>
  );
};

export function Searchbar() {
  return (
    // You could have a loading skeleton as the `fallback` too
    <Suspense>
      <SearchInput />
    </Suspense>
  );
}
