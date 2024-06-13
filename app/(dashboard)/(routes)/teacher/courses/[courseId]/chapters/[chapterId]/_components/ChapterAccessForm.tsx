"use client";

import Editor from "@/components/Editor";
import Preview from "@/components/Preview";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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

interface ChapterAccessFormProps {
  initialData: Chapter;
  courseId: string;
  chapterId: string;
}

const formSchema = z.object({
  isFree: z.boolean().default(false),
});

type formSchemaType = z.infer<typeof formSchema>;

const ChapterAccessForm: FC<ChapterAccessFormProps> = ({
  initialData,
  courseId,
  chapterId,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const form = useForm<formSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isFree: !!initialData?.isFree,
    },
  });

  const { isValid } = form.formState;

  const { mutate: updateChapterDescription, isPending } = useMutation({
    mutationFn: async ({ isFree }: formSchemaType) => {
      const payload: formSchemaType = {
        isFree,
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
      isFree: values.isFree,
    };
    updateChapterDescription(payload);
  };

  return (
    <>
      <div className=" mt-6 border bg-slate-100 rounded-md p-4">
        <div className=" font-medium flex items-center justify-between">
          Course Access
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
                Edit access
              </>
            )}
          </Button>
        </div>

        {!isEditing && (
          <div
            className={cn(
              "text-sm mt-2",
              !initialData.isFree  && " text-slate-500 italic"
            )}
          >
            {initialData.isFree ? (
              <>This chapter is free for preview.</>
            ) : <>
              This chapter is not free.
            </>}
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
                    name="isFree"
                    render={({ field }) => (
                      <FormItem className=" flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className=" space-y-1 leading-none">
                          <FormDescription>
                            Check this box if you want to make this chapter free for preview
                          </FormDescription>
                        </div>
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

export default ChapterAccessForm;

{
  /* */
}
