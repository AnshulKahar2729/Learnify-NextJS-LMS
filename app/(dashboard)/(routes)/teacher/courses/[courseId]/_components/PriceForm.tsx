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
import { Textarea } from "@/components/ui/textarea";
import { formatPrice } from "@/lib/format";
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

interface PriceFormProps {
  initialData: Course;
  courseId: string;
}

const formSchema = z.object({
  price: z.coerce.number(),
});

type formSchemaType = z.infer<typeof formSchema>;

const PriceForm: FC<PriceFormProps> = ({ initialData, courseId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const form = useForm<formSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      price: initialData?.price || undefined,
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const { mutate: updatePrice, isPending } = useMutation({
    mutationFn: async ({ price }: formSchemaType) => {
      const payload: formSchemaType = {
        price,
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
    const payload: formSchemaType = {
      price: values.price,
    };
    updatePrice(payload);
  };

  return (
    <>
      <div className=" mt-6 border bg-slate-100 rounded-md p-4">
        <div className=" font-medium flex items-center justify-between">
          Course Price
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
                Edit Price
              </>
            )}
          </Button>
        </div>

        {!isEditing && (
          <p
            className={cn(
              "text-sm mt-2",
              !initialData.price && " text-slate-500 italic"
            )}
          >
            {initialData.price ? formatPrice(initialData.price) : "No price provided."}
          </p>
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
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="number"
                            step={0.01}
                            placeholder="Price of your course"
                            disabled={isSubmitting}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          What is the price of the course?
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

export default PriceForm;

{
  /* */
}
