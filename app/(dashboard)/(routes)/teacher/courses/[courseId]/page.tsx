import React from 'react'
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

const CourseIdPage = async ({ params }: { params: { courseId: string } }) => {

    const { userId } = auth();
    if (!userId) {
        return redirect("/");
    }

    const courseId = params.courseId;
    const course = await db.course.findUnique({
        where: {
            id: courseId
        }
    });

    if (!course?.id) {
        return redirect("/teacher/courses");
    }

    const courseFields = [
        course.title,
        course.description,
        course.price,
        course.imageUrl,
        course.categoryId
    ];

    const totalFields = courseFields.length;
    const completedFields = courseFields.filter(Boolean).length;

    const completionText = `${completedFields} of ${totalFields} fields completed`;

    return (
        <div className='p-6'>
            <div className='flex items-center justify-between'>
                <div className=' flex flex-col gap-y-2'>
                    <h1 className=' font-medium text-2xl'>
                        Course Setup
                    </h1>
                    <span className=' text-slate-700 text-sm'>
                        {completionText}
                    </span>
                </div>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 mt-16 gap-6'>
                <div className=' flex items-center gap-x-2'>
                    <h2 className='text-xl'>
                        Customize your course
                    </h2>
                </div>
            </div>
        </div>
    )
}

export default CourseIdPage; 