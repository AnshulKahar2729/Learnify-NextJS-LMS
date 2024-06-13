import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { courseId } = params;

    const course = await db.course.findUnique({
      where: {
        id: courseId,
        userId: userId,
      },
      include: {
        chapters: {
          include: {
            muxData: true,
          },
        },
      },
    });

    if (!course) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const hasPublishedChapter = course.chapters.some(
      (chapter) => chapter.isPublished
    );

    if (
      !course.title ||
      !course.description ||
      !course.imageUrl ||
      !hasPublishedChapter
    ) {
      return new NextResponse("Missing required fields.", { status: 401 });
    }

    const publishedCourse = await db.course.update({
      where: {
        id: courseId,
        userId: userId,
      },
      data: {
        isPublished: true,
      },
    });

    return new NextResponse("Course has been published successfully!!", { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }
    console.log("Error from POST /api/courses: ", error);
    return new NextResponse("Could not create a course ", { status: 500 });
  }
}
