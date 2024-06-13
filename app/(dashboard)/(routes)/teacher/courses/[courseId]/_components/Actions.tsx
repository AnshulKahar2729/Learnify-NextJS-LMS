"use client";

import ConfirmModal from "@/components/modals/ConfirmModal";
import { Button } from "@/components/ui/button";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { FC } from "react";
import toast from "react-hot-toast";

interface ActionsProps {
  courseId: string;
  isPublished: boolean;
  disabled: boolean;
}
const Actions: FC<ActionsProps> = ({ courseId, disabled, isPublished }) => {
  const router = useRouter();
  const confetti = useConfettiStore();
  const { mutate: deleteCourse, isPending: isDeletePending } = useMutation({
    mutationFn: async () => {
      await axios.delete(`/api/courses/${courseId}`);
      return;
    },
    onSuccess: () => {
      router.push(`/teacher/courses`);
      router.refresh();
      toast.success("Course has been deleted successfully!");
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

  const {
    mutate: togglePublishCourse,
    isPending: isTogglePublishCoursePending,
  } = useMutation({
    mutationFn: async () => {
      if (isPublished) {
        await axios.patch(`/api/courses/${courseId}/unpublish`);
      } else {
        await axios.patch(`/api/courses/${courseId}/publish`);
      }
      return;
    },
    onSuccess: () => {
      router.refresh();
      if (isPublished) {
        toast.success("Course has been unpublished successfully!");
      } else {
        toast.success("Course has been published successfully!");
        confetti.onOpen();
      }
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

  return (
    <div className=" flex items-center gap-x-2">
      <Button
        onClick={() => togglePublishCourse()}
        disabled={disabled || isDeletePending || isTogglePublishCoursePending}
        variant={"outline"}
        size={"sm"}
      >
        {isPublished ? "Unpublish" : "Publish"}
      </Button>
      <ConfirmModal
        onConfirm={() => {
          deleteCourse();
        }}
      >
        <Button
          size={"sm"}
          disabled={isDeletePending || isTogglePublishCoursePending}
        >
          <Trash className=" h-4 w-4" />
        </Button>
      </ConfirmModal>
    </div>
  );
};

export default Actions;
