"use client";

import { Button } from "@/components/ui/button";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { FC } from "react";
import toast from "react-hot-toast";

interface CourseProgressButtonProps {
  courseId: string;
  isCompleted?: boolean;
  nextChapterId?: string;
  chapterId: string;
}
const CourseProgressButton: FC<CourseProgressButtonProps> = ({
  chapterId,
  nextChapterId,
  courseId,
  isCompleted,
}) => {
  const router = useRouter();
  const confetti = useConfettiStore();

  const { mutate: toggleIsCompleted, isPending } = useMutation({
    mutationFn: async () => {
      await axios.put(
        `/api/courses/${courseId}/chapters/${chapterId}/progress`,
        { isCompleted: !isCompleted }
      );

      return;
    },
    onSuccess: () => {
      if (!isCompleted && !nextChapterId) {
        confetti.onOpen();
      }

      if (!isCompleted && nextChapterId) {
        router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
      }

      toast.success("Progress updated successfully.");
      router.refresh();
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
  const Icon = isCompleted ? XCircle : CheckCircle;
  return (
    <Button
      onClick={() => {
        toggleIsCompleted();
      }}
      disabled={isPending}
      isLoading={isPending}
      className="
     w-full md:w-auto"
      type="button"
      variant={isCompleted ? "outline" : "success"}
    >
      {isCompleted ? "Not completed" : "Mark as complete"}
      <Icon className=" w-4 h-4 ml-2" />
    </Button>
  );
};

export default CourseProgressButton;
