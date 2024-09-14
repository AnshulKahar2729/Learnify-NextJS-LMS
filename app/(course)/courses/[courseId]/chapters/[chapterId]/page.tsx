import { getChapter } from "@/actions/get-chapter";
import Banner from "@/components/Banner";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React, { FC } from "react";
import VideoPlayer from "./_components/VideoPlayer";
import CourseEnrollButton from "./_components/CourseEnrollButton";
import { Separator } from "@/components/ui/separator";
import Preview from "@/components/Preview";
import { File } from "lucide-react";
import CourseProgressButton from "./_components/CourseProgressButton";

const ChapterIdPage = async ({
  params,
}: {
  params: { courseId: string; chapterId: string };
}) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/sign-in");
  }

  const {
    attachments,
    chapter,
    course,
    muxData,
    nextChapter,
    purchase,
    userProgress,
  } = await getChapter({
    userId,
    courseId: params.courseId,
    chapterId: params.chapterId,
  });

  if (!chapter || !course) {
    return redirect("/404");
  }

  const isLocked = !chapter.isFree && !purchase;
  const completeOnEnd = !!purchase && !userProgress?.isCompleted;
  return (
    <div>
      {userProgress?.isCompleted && (
        <Banner
          variant={"success"}
          label="You have already completed this chapter"
        />
      )}
      {isLocked && (
        <Banner
          variant={"warning"}
          label="You need to purchase this course to access this chapter"
        />
      )}
      <div className=" flex flex-col max-w-4xl mx-auto pb-20">
        <div className=" p-4">
          <VideoPlayer
            chapterId={params.chapterId}
            title={chapter.title}
            courseId={params.courseId}
            nextChapterId={nextChapter?.id}
            playbackId={muxData?.playbackId!}
            isLocked={isLocked}
            completeOnEnd={completeOnEnd}
          />
        </div>
        <div>
          <div className=" p-4 flex flex-col md:flex-row items-center justify-between">
            <h2 className=" text-2xl font-semibold mb-2">{chapter.title}</h2>
            {purchase ? (
              <CourseProgressButton
                chapterId={params.chapterId}
                courseId={params.courseId}
                nextChapterId={nextChapter?.id}
                isCompleted={!!userProgress?.isCompleted}
              />
            ) : (
              <>
                <CourseEnrollButton
                  courseTitle={course.title}
                  courseDescription={course.description || ""}
                  courseImageUrl={course.imageUrl || ""}
                  courseId={params.courseId}
                  price={course.price!}
                />
              </>
            )}
          </div>
          <Separator />
          <div className=" p-4">
            {/* {chapter.description && <Preview value={chapter.description!} />} */}
            <span className=" font-bold">Course description</span> -{" "}
            {chapter.description!}
          </div>
          {!!attachments.length && (
            <>
              <Separator />
              <div className=" p-4">
                {attachments.map((attachment) => (
                  <a
                    href={attachment.url}
                    target="_blank"
                    key={attachment.id}
                    className=" flex items-center p-3 w-full bg-sky-200 border border-sky-700 rounded-md hover:underline"
                  >
                    <File className="" />
                    <p className=" line-clamp-1">{attachment.name}</p>
                  </a>
                ))}
              </div>
            </>
          )}
          {isLocked && (
            <div className=" p-4">
              <p className=" flex items-center p-3 w-full bg-sky-200 border border-sky-700 rounded-md hover:underline ">
                <File className="" />
                This chapter is locked. You need to purchase this course to
                access the attached files.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChapterIdPage;
