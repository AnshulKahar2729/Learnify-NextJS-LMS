import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Chapter, Course, UserProgress } from "@prisma/client";
import { Menu } from "lucide-react";
import React, { FC } from "react";
import CourseSidebar from "./CourseSidebar";

interface CourseMobileSidebarProps {
  course: Course & {
    chapters: (Chapter & {
      userProgress: UserProgress[] | null;
    })[];
  };
  progressCount: number;
}
const CourseMobileSidebar: FC<CourseMobileSidebarProps> = ({
  course,
  progressCount,
}) => {
  return (
    <Sheet>
      <SheetTrigger className=" md:hidden pr-4 hover:opacity-75 transition">
        <Menu className=" cursor-pointer text-xl text-gray-500" />
      </SheetTrigger>
      <SheetContent className=" p-0 bg-white w-72" side={"left"}>
        <CourseSidebar course={course} progressCount={progressCount} />
      </SheetContent>
    </Sheet>
  );
};

export default CourseMobileSidebar;
