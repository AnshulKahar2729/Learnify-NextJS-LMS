import React from "react";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { notFound, redirect } from "next/navigation";
import { IconBadge } from "@/components/icon-badge";
import { CircleDollarSign, File, LayoutDashboard, ListChecks } from "lucide-react";
import TitleForm from "./_components/TitleForm";
import DescriptionForm from "./_components/DescriptionForm";
import ImageForm from "./_components/ImageForm";
import CategoryForm from "./_components/CategoryForm";
import PriceForm from "./_components/PriceForm";
import AttachmentForm from "./_components/AttachmentForm";
import ChaptersForm from "./_components/ChaptersForm";

const CourseIdPage = async ({ params }: { params: { courseId: string } }) => {
  const { userId } = auth();
  if (!userId) {
    return redirect("/");
  }

  const courseId = params.courseId;
  const course = await db.course.findUnique({
    where: {
      id: courseId,
      userId
    },
    include : {
      attachments : {
        orderBy : {
          createdAt : "desc"
        }
      },
      chapters : {
        orderBy : {
          position : "asc"
        }
      }
    }
  });

  const catgories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  // console.log(catgories);

  if (!course?.id) {
    // return notFound();
    return redirect("/teacher/courses");
  }

  const courseFields = [
    course.title,
    course.description,
    course.price,
    course.imageUrl,
    course.categoryId,
    course.chapters.some((chapter) => chapter.isPublished),
  ];

  const totalFields = courseFields.length;
  const completedFields = courseFields.filter(Boolean).length;

  const completionText = `${completedFields} of ${totalFields} fields completed`;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className=" flex flex-col gap-y-2">
          <h1 className=" font-medium text-2xl">Course Setup</h1>
          <span className=" text-slate-700 text-sm">{completionText}</span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 mt-16 gap-6">
        <div>
          <div className=" flex items-center gap-x-2">
            <IconBadge icon={LayoutDashboard} />
            <h2 className="text-xl">Customize your course</h2>
          </div>
          <TitleForm initialData={course} courseId={course.id} />
          <DescriptionForm initialData={course} courseId={course.id} />
          <ImageForm initialData={course} courseId={course.id} />
          {catgories.length !== 0 && (
            <CategoryForm
              initialData={course}
              courseId={course.id}
              options={catgories.map((category) => ({
                label: category.name,
                value: category.id,
              }))}
            />
          )}
        </div>
        <div className=" space-y-6">
          <div>
            <div className=" flex items-center gap-x-2">
              <IconBadge icon={ListChecks}/>
              <h2 className=" text-xl">
                Course chapters
              </h2>
            </div>
            <ChaptersForm initialData={course} courseId={course.id}/>
          </div>
          <div>
            <div className=" flex items-center gap-x-2">
              <IconBadge icon={CircleDollarSign}/>
              <h2 className=" text-xl">
                Sell your course
              </h2>
            </div>
            <PriceForm initialData={course} courseId={course.id}/>
          </div>
          <div>
            <div className=" flex items-center gap-x-2">
              <IconBadge icon={File}/>
              <h2 className=" text-xl">
                Resources & Attachments
              </h2>
            </div>
            <AttachmentForm initialData={course} courseId={course.id}/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseIdPage;
