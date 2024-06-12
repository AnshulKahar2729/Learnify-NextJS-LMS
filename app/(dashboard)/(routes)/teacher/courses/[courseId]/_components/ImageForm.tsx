"use client";

import FileUpload from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Course } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { ImageIcon, Pencil, PlusCircle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { FC, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface ImageFormProps {
  initialData: Course;
  courseId: string;
}

const formSchema = z.object({
  imageUrl: z.string().min(1, {
    message: "Image is required",
  }),
});

type formSchemaType = z.infer<typeof formSchema>;

const ImageForm: FC<ImageFormProps> = ({ initialData, courseId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const { mutate: uploadImage } = useMutation({
    mutationFn: async ({ imageUrl }: formSchemaType) => {
      const payload: formSchemaType = {
        imageUrl,
      };

      await axios.patch(`/api/courses/${courseId}`, payload);
      return;
    },
    onSuccess: () => {
      setIsEditing(false);
      router.refresh();
      toast.success("Course image has been updated successfully!");
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
      imageUrl: values.imageUrl,
    };
    uploadImage(payload);
  };

  return (
    <>
      <div className=" mt-6 border bg-slate-100 rounded-md p-4">
        <div className=" font-medium flex items-center justify-between">
          Course Image
          <Button
            onClick={() => {
              setIsEditing((prev) => !prev);
            }}
            variant={"ghost"}
          >
            {isEditing && <>Cancel</>}
            {!isEditing && !initialData.imageUrl && (
              <>
                <PlusCircle className=" h-4 w-4 mr-2" />
                Add an image
              </>
            )}
            {!isEditing && initialData.imageUrl && (
              <>
                <Pencil className=" h-4 w-4 mr-2" />
                Edit image
              </>
            )}
          </Button>
        </div>

        {!isEditing &&
          (!initialData.imageUrl ? (
            <div className=" flex items-center justify-center h-60 bg-slate-200 rounded-md">
              <ImageIcon className=" h-10 w-10 text-slate-500" />
            </div>
          ) : (
            <div className=" relative aspect-video mt-2">
              <Image
                src={initialData?.imageUrl}
                alt="Upload"
                className=" object-cover rounded-md"
                fill
              />
            </div>
          ))}
        {isEditing && (
          <>
            <div>
              <FileUpload
                endpoint="courseImage"
                onChange={(url) => {
                  if (url) {
                    onSubmit({ imageUrl: url });
                  }
                }}
              />
            </div>
            <div className=" text-xs text-muted-foreground mt-4">
              16:9 aspect ratio recommended
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ImageForm;

{
  /* */
}
