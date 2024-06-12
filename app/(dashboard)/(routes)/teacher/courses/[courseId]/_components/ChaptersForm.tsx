"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Chapter, Course } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { Pencil, PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { FC, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface ChaptersFormProps {
  initialData: Course & { chapters: Chapter[] };
  courseId: string;
}

const formSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required",
  }),
});

type formSchemaType = z.infer<typeof formSchema>;

const ChaptersForm: FC<ChaptersFormProps> = ({ initialData, courseId }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  const form = useForm<formSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const { mutate: addChapters, isPending } = useMutation({
    mutationFn: async ({ title }: formSchemaType) => {
      const payload: formSchemaType = {
        title,
      };

      await axios.post(`/api/courses/${courseId}/chapters`, payload);
      return;
    },
    onSuccess: () => {
      setIsCreating(false);
      router.refresh();
      toast.success("Chapters created!");
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
      title: values.title,
    };
    addChapters(payload);
  };

  return (
    <>
      <div className=" mt-6 border bg-slate-100 rounded-md p-4">
        <div className=" font-medium flex items-center justify-between">
          Course Chapters
          <Button
            onClick={() => {
              setIsCreating((prev) => !prev);
            }}
            variant={"ghost"}
          >
            {isCreating ? (
              <>Cancel</>
            ) : (
              <>
                <PlusCircle className=" w-4 h-4 mr-2" />
                Add a chapter
              </>
            )}
          </Button>
        </div>
        {isCreating && (
          <>
            <div>
              <Form {...form}>
                <form
                  className=" space-y-4 mt-4"
                  onSubmit={form.handleSubmit(onSubmit)}
                >
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="e.g. 'Introduction to the course'"
                            disabled={isSubmitting}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          What will you teach in this course?
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={isPending || !isValid}
                    isLoading={isPending}
                  >
                    Create
                  </Button>
                </form>
              </Form>
            </div>
          </>
        )}
        {!isCreating && (
            <div className={cn(" text-sm mt-2", !initialData.chapters.length && " text-slate-500 italic")}>
                {!initialData.chapters.length && "No chapters yet"}
                {/* TODO : ADD LIST OF CHAPTERS */}
            </div>
        )}
        {!isCreating && (
            <p className=" text-xs mt-4 text-muted-foreground">
                Drag and drop to reorder the chapters
            </p>
        )}
      </div>
    </>
  );
};

export default ChaptersForm;

{
  /* */
}
