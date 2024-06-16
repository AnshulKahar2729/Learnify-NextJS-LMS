"use client";

import Editor from "@/components/Editor";
import Preview from "@/components/Preview";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Chapter } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { FC, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface ChapterDescriptionFormProps {
  initialData: Chapter;
  courseId: string;
  chapterId: string;
}

const formSchema = z.object({
  description: z.string().min(1, {
    message: "Description is required",
  }),
});

type formSchemaType = z.infer<typeof formSchema>;

const ChapterDescriptionForm: FC<ChapterDescriptionFormProps> = ({
  initialData,
  courseId,
  chapterId,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const form = useForm<formSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: initialData?.description || "",
    },
  });

  const { isValid } = form.formState;

  const { mutate: updateChapterDescription, isPending } = useMutation({
    mutationFn: async ({ description }: formSchemaType) => {
      const payload: formSchemaType = {
        description,
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
      description: values.description,
    };
    updateChapterDescription(payload);
  };

  return (
    <>
      <div className=" mt-6 border bg-slate-100 rounded-md p-4">
        <div className=" font-medium flex items-center justify-between">
          Course Description
          <Button
            onClick={() => {
              setIsEditing((prev) => !prev);
            }}
            variant={"ghost"}
          >
            {isEditing ? (
              <>Cancel</>
            ) : (
              <>
                <Pencil className=" w-4 h-4 mr-2" />
                Edit Description
              </>
            )}
          </Button>
        </div>

        {!isEditing && (
          <div
            className={cn(
              "text-sm mt-2",
              !initialData.description && " text-slate-500 italic"
            )}
          >
            {!initialData.description && "No description provided"}
            {initialData.description && (
              <Preview value={initialData.description} />
            )}
          </div>
        )}
        {isEditing && (
          <>
            <div>
              <Form {...form}>
                <form
                  className=" space-y-4 mt-4"
                  onSubmit={form.handleSubmit(onSubmit)}
                >
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Editor {...field} />
                        </FormControl>
                        <FormDescription>
                          What will you teach in this course?
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className=" flex items-center gap-x-2">
                    <Button
                      type="submit"
                      disabled={isPending || !isValid}
                      isLoading={isPending}
                    >
                      Save
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ChapterDescriptionForm;

{
  /* */
}
