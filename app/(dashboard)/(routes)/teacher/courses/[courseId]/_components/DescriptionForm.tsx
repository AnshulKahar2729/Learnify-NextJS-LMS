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
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Course } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { FC, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface DescriptionFormProps {
  initialData: Course;
  courseId: string;
}

const formSchema = z.object({
  description: z.string().min(1, {
    message: "Description is required",
  }),
});

type formSchemaType = z.infer<typeof formSchema>;


const DescriptionForm: FC<DescriptionFormProps> = ({
  initialData,
  courseId,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const form = useForm<formSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: initialData?.description || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const { mutate: updateDescription, isPending } = useMutation({
    mutationFn: async ({ description }: formSchemaType) => {
      const payload: formSchemaType = {
        description,
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
    const payload : formSchemaType = {
      description: values.description
    };
    updateDescription(payload);
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

        {!isEditing && <p className={cn("text-sm mt-2", !initialData.description && " text-slate-500 italic")}>
          {initialData.description || "No description provided"}
          </p>}
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
                          <Textarea
                            placeholder="e.g. 'This course is about ...'"
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

export default DescriptionForm;

{
  /* */
}
