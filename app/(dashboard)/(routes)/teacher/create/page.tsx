"use client";
import axios, { AxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  CourseTitlePayload,
  CourseTitleValidator,
} from "@/lib/validators/course";
import { useMutation } from "@tanstack/react-query";

const CreatePage = () => {
  const router = useRouter();
  const form = useForm<CourseTitlePayload>({
    resolver: zodResolver(CourseTitleValidator),
    defaultValues: {
      title: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const { mutate: createCourse, isPending } = useMutation({
    mutationFn: async ({ title }: CourseTitlePayload) => {
      const payload = {
        title: title,
      };

      const { data } = await axios.post("/api/courses", payload);
      return data;
    },
    onSuccess: (data) => {
      router.push(`/teacher/courses/${data.id}`);
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

  const onSubmit = async (values: CourseTitlePayload) => {
    const payload: CourseTitlePayload = {
      title: values.title,
    };

    createCourse(payload);
  };

  return (
    <div className=" max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6">
      <div>
        <h1 className=" text-2xl">Name your course</h1>
        <p className=" text-sm text-slate-600">
          What would you like to name your couse? Don&apos;t worry, you can
          change this later.
        </p>
        <Form {...form}>
          <form
            className=" space-y-8 mt-8"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course title</FormLabel>
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
              <Link href={"/"}>
                <Button type="button" variant={"ghost"}>
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={isPending || !isValid}
                isLoading={isPending}
              >
                Continue
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreatePage;
