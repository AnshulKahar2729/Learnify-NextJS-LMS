import Image from "next/image";
import Link from "next/link";
import React, { FC } from "react";
import { IconBadge } from "./icon-badge";
import { BookOpen } from "lucide-react";
import { formatPrice } from "@/lib/format";
import CourseProgress from "./CourseProgress";

interface CourseCardProps {
  id: string;
  title: string;
  imageUrl: string;
  chaptersLength: number;
  price: number;
  progress: number | null;
  category: string;
}
const CourseCard: FC<CourseCardProps> = ({
  id,
  title,
  imageUrl,
  chaptersLength,
  price,
  progress,
  category,
}) => {
  return (
    <Link href={`/courses/${id}`} className="">
      <div className=" group hover:shadow-sm transition overflow-hidden border rounded-lg p-3 ">
        <div className=" z-[-1] relative h-full aspect-video rounded-md overflow-hidden">
          <Image fill alt={title} src={imageUrl} className=" object-cover" />
        </div>
        <div className=" flex flex-col pt-2">
          <div className=" text-lg md:text-base font-medium group-hover:text-sky-700 transition line-clamp-2">
            {title}
          </div>
          <p className=" text-xs text-muted-foreground">{category}</p>
          <div className=" my-3 flex items-center gap-x-2 text-sm md:text-xs">
            <div className=" flex items-center gap-x-1 text-slate-500">
              <IconBadge size={"sm"} icon={BookOpen} />
              <span>
                {chaptersLength} {chaptersLength === 1 ? "Chapter" : "Chapters"}
              </span>
            </div>
          </div>
          {progress !== null ? (
           <CourseProgress
            size="sm"
            value={progress}
            variant={progress === 100 ? "success" : "default"}
           />
          ) : (
            <p className=" text-md md:text-sm font-medium text-slate-700">
              {formatPrice(price)}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
