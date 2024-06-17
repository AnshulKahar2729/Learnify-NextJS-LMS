import { db } from "@/lib/db";
import React from "react";
import Categories from "./_components/Categories";
import { Searchbar } from "@/components/SearchInput";
import { getCourses } from "@/actions/get-courses";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import CoursesList from "@/components/CoursesList";

interface SearchPageProps {
  searchParams: {
    title: string;
    categoryId: string;
  };
}

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const { userId } = auth();
  if (!userId) return redirect("/sign-in");
  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const courses = await getCourses({
    userId,
    categoryId: searchParams.categoryId,
    title: searchParams.title,
  });

  console.log(categories);
  return (
    <>
      <div className=" px-6 pt-6 md:hidden md:mb-0 block ">
        <Searchbar />
      </div>
      <div className=" p-6 space-y-4 ">
        <Categories items={categories} />
        <CoursesList items={courses} />
      </div>
    </>
  );
};

export default SearchPage;
