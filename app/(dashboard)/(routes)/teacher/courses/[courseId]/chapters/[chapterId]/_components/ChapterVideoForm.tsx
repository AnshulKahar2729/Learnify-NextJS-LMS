"use client";

import FileUpload from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import { Chapter, MuxData } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { Pencil, PlusCircle, VideoIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { FC, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import MuxPlayer from "@mux/mux-player-react";

interface ChapterVideoFormProps {
  initialData: Chapter & { muxData?: MuxData | null };
  courseId: string;
  chapterId: string;
}

const formSchema = z.object({
  videoUrl: z.string().min(1),
});

type formSchemaType = z.infer<typeof formSchema>;

const ChapterVideoForm: FC<ChapterVideoFormProps> = ({
  initialData,
  courseId,
  chapterId,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const { mutate: uploadImage } = useMutation({
    mutationFn: async ({ videoUrl }: formSchemaType) => {
      const payload: formSchemaType = {
        videoUrl,
      };

      await axios.patch(
        `/api/courses/${courseId}/chapters/${chapterId}`,
        payload
      );
      return;
    },
    onSuccess: () => {
      setIsEditing(false);
      router.refresh();
      toast.success("Chapter updated!");
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          return router.push("/sign-in");
        }
      }
      toast.error("An error occurred. Please try again.");
    },
  });

  const onSubmit = async (values: formSchemaType) => {
    const payload: formSchemaType = {
      videoUrl: values.videoUrl,
    };
    uploadImage(payload);
  };

  return (
    <>
      <div className=" mt-6 border bg-slate-100 rounded-md p-4">
        <div className=" font-medium flex items-center justify-between">
          Chapter Video
          <Button
            onClick={() => {
              setIsEditing((prev) => !prev);
            }}
            variant={"ghost"}
          >
            {isEditing && <>Cancel</>}
            {!isEditing && !initialData.videoUrl && (
              <>
                <PlusCircle className=" h-4 w-4 mr-2" />
                Add an video
              </>
            )}
            {!isEditing && initialData.videoUrl && (
              <>
                <Pencil className=" h-4 w-4 mr-2" />
                Edit video
              </>
            )}
          </Button>
        </div>

        {!isEditing &&
          (!initialData.videoUrl ? (
            <div className=" flex items-center justify-center h-60 bg-slate-200 rounded-md">
              <VideoIcon className=" h-10 w-10 text-slate-500" />
            </div>
          ) : (
            <div className=" relative aspect-video mt-2">
              <MuxPlayer playbackId={initialData?.muxData?.playbackId || ""} />
            </div>
          ))}
        {isEditing && (
          <>
            <div>
              <FileUpload
                endpoint="chapterVideo"
                onChange={(url) => {
                  if (url) {
                    onSubmit({ videoUrl: url });
                  }
                }}
              />
            </div>
            <div className=" text-xs text-muted-foreground mt-4">
              Upload this chapter&apbs;s video
            </div>
          </>
        )}
        {initialData.videoUrl && !isEditing && (
          <div className=" text-xs text-muted-foreground mt-2">
            Videos can take a fiew minutes to process. Rerfresh the page if
            video does not appear
          </div>
        )}
      </div>
    </>
  );
};

export default ChapterVideoForm;

{
  /* */
}
