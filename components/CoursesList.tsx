import { Category, Course } from "@prisma/client";
import React, { FC } from "react";
import CourseCard from "@/components/CourseCard";

type CourseWithProgressWithCategory = Course & {
  category: Category | null;
  chapters: { id: string }[];
  progress: number | null;
};

interface CoursesListProps {
  items: CourseWithProgressWithCategory[];
}
const CoursesList: FC<CoursesListProps> = ({ items }) => {
  return (
    <div>
      <div className=" grid sm:grid-cols-2 md:grid-cols-2  lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
        {items.map((item) => (
          <div className="" key={item.id}>
            <CourseCard
              key={item.id}
              id={item.id}
              title={item.title}
              imageUrl={item.imageUrl!}
              chaptersLength={item.chapters.length}
              price={item.price!}
              progress={item.progress}
              category={item?.category?.name!}
            />
          </div>
        ))}
      </div>
      {items.length === 0 && (
        <div className=" text-center text-muted-foreground text-sm mt-10">
          No courses found
        </div>
      )}
    </div>
  );
};

export default CoursesList;
