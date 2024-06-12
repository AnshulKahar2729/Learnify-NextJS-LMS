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
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { FC, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface TitleFormProps {
  initialData: {
    title : string;
  };
  courseId: string;
}

const formSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required",
  }),
});

type formSchemaType = z.infer<typeof formSchema>;

const TitleForm: FC<TitleFormProps> = ({ initialData, courseId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const form = useForm<formSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData.title,
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const { mutate: updateTitle, isPending } = useMutation({
    mutationFn: async ({ title }: formSchemaType) => {
      const payload: formSchemaType = {
        title,
      };

      await axios.patch(`/api/courses/${courseId}`, payload);
      return;
    },
    onSuccess: () => {
      setIsEditing(false);
      router.refresh();
      toast.success("Course created successfully!");
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
    const payload = {
      title: values.title,
    };
    updateTitle(payload);
  };

  return (
    <>
      <div className=" mt-6 border bg-slate-100 rounded-md p-4">
        <div className=" font-medium flex items-center justify-between">
          Course Title
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
                Edit Title
              </>
            )}
          </Button>
        </div>

        {!isEditing && <p className=" text-sm mt-2">{initialData.title}</p>}
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
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="e.g. 'Advanced web development'"
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

export default TitleForm;

{
  /* */
}
