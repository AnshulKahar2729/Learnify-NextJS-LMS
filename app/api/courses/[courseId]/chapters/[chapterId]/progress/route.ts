import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { json } from "stream/consumers";

export async function PUT(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { isCompleted } = await req.json();
    const userProgress = await db.userProgress.upsert({
      where: {
        userId_chapterId: {
          userId,
          chapterId: params.chapterId,
        },
      },
      update: {
        isCompleted,
      },
      create: {
        userId,
        chapterId: params.chapterId,
        isCompleted,
      },
    });

    return NextResponse.json(userProgress, { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse("An error occurred", { status: 500 });
  }
}
