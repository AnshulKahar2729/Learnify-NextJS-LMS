"use client";

import FileUpload from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Attachment, Course } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { File, ImageIcon, Loader2, Pencil, PlusCircle, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { FC, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { set, z } from "zod";

interface AttachmentFormProps {
  initialData: Course & { attachments: Attachment[] };
  courseId: string;
}

const formSchema = z.object({
  url: z.string().min(1, {
    message: "Image is required",
  }),
});

type formSchemaType = z.infer<typeof formSchema>;

const AttachmentForm: FC<AttachmentFormProps> = ({ initialData, courseId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  const { mutate: deleteAttachment } = useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      await axios.delete(`/api/courses/${courseId}/attachments/${id}`);
      return;
    },
    onSuccess: () => {
      setDeletingId(null);
      router.refresh();
      toast.success("Attachment has been deleted successfully!");
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          return router.push("/sign-in");
        }
      }
      setDeletingId(null);
      toast.error("An error occurred. Please try again.");
    },
  });

  const { mutate: uploadAttachments } = useMutation({
    mutationFn: async ({ url }: formSchemaType) => {
      const payload: formSchemaType = {
        url,
      };

      await axios.post(`/api/courses/${courseId}/attachments`, payload);
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
      url: values.url,
    };
    uploadAttachments(payload);
  };

  return (
    <>
      <div className=" mt-6 border bg-slate-100 rounded-md p-4">
        <div className=" font-medium flex items-center justify-between">
          Course attachments
          <Button
            onClick={() => {
              setIsEditing((prev) => !prev);
            }}
            variant={"ghost"}
          >
            {isEditing && <>Cancel</>}
            {!isEditing && (
              <>
                <PlusCircle className=" h-4 w-4 mr-2" />
                Add a file
              </>
            )}
          </Button>
        </div>

        {!isEditing && (
          <>
            {initialData.attachments.length === 0 && (
              <p className=" text-sm mt-2 text-slate-500 italic">
                No attachments yet
              </p>
            )}
            {initialData.attachments.length > 0 && (
              <div className=" space-y-2">
                {initialData.attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className=" flex items-center p-3 w-full border-y-sky-100 border-sky-200 border text-sky-700 rounded-md"
                  >
                    <div className=" flex items-center space-x-2">
                      <File className=" h-4 w-4 mr-2 flex-shrink-0" />
                      <a
                        href={attachment.url}
                        target="_blank"
                        className=" text-sm text-blue-500 line-clamp-1"
                      >
                        {attachment.name}
                      </a>
                      {deletingId === attachment.id && (
                        <div>
                          <Loader2 className=" h-4 w-4 animate-spin" />
                        </div>
                      )}
                      {deletingId !== attachment.id && (
                        <button
                          onClick={() => {
                            setDeletingId(attachment.id);
                            deleteAttachment({ id: attachment.id });
                          }}
                          className=" ml-auto hover:opacity-75 transition"
                        >
                          <X className=" h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
        {isEditing && (
          <>
            <div>
              <FileUpload
                endpoint="courseAttachment"
                onChange={(url) => {
                  if (url) {
                    onSubmit({ url: url });
                  }
                }}
              />
            </div>
            <div className=" text-xs text-muted-foreground mt-4">
              Add anything that your students might need to complete the course.
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default AttachmentForm;

{
  /* */
}
