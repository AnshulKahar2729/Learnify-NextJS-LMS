import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import { DataTable } from "./_components/DataTable";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { redirect, useRouter } from "next/navigation";
import { columns } from "./_components/Columns";

const CoursesPage = async () => {
  const { userId } = auth();
  if (!userId) {
    return redirect("/sign-in");
  }
  const courses = await db.course.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className=" p-6">
      <DataTable data={courses} columns={columns} />
    </div>
  );
};

export default CoursesPage;
