import React, { FC } from "react";
import { Progress } from "./ui/progress";
import { cn } from "@/lib/utils";

interface CourseProgressProps {
  value: number;
  variant?: "default" | "success";
  size?: "default" | "sm";
}

const colorsByVariant = {
  default: "bg-sky-700",
  success: "bg-emerald-700",
};

const sizeByVariant = {
  default: "text-sm",
  sm: "text-xs",
};

const CourseProgress: FC<CourseProgressProps> = ({ value, variant, size }) => {
  return (
    <div>
      <Progress className=" h-2" value={value} variant={variant} />
      <p
        className={cn(
          "font-medium mt-2 text-sky-700",
          colorsByVariant[variant || "default"],
          sizeByVariant[size || "default"]
        )}
      >
        {Math.round(value)}% Complete
      </p>
    </div>
  );
};

export default CourseProgress;
