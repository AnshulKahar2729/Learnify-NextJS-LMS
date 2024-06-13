"use client";

import ConfirmModal from "@/components/modals/ConfirmModal";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { FC } from "react";
import toast from "react-hot-toast";

interface ChapterActionsProps {
  courseId: string;
  chapterId: string;
  isPublished: boolean;
  disabled: boolean;
}
const ChapterActions: FC<ChapterActionsProps> = ({
  courseId,
  chapterId,
  disabled,
  isPublished,
}) => {
  const router = useRouter();
  const { mutate: deleteChapter, isPending: isDeletePending } = useMutation({
    mutationFn: async () => {
      await axios.delete(`/api/courses/${courseId}/chapters/${chapterId}`);
      return;
    },
    onSuccess: () => {
      router.push(`/teacher/courses/${courseId}`);
      router.refresh();
      toast.success("Chapter has been deleted successfully!");
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
    mutate: togglePublishChapter,
    isPending: isTogglePublishChapterPending,
  } = useMutation({
    mutationFn: async () => {
      if (isPublished) {
        await axios.patch(
          `/api/courses/${courseId}/chapters/${chapterId}/unpublish`
        );
      } else {
        await axios.patch(
          `/api/courses/${courseId}/chapters/${chapterId}/publish`
        );
      }
      return;
    },
    onSuccess: () => {
      router.refresh();
      if (isPublished) {
        toast.success("Chapter has been unpublished successfully!");
      } else {
        toast.success("Chapter has been published successfully!");
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
        onClick={() => togglePublishChapter()}
        disabled={disabled || isDeletePending || isTogglePublishChapterPending}
        variant={"outline"}
        size={"sm"}
      >
        {isPublished ? "Unpublish" : "Publish"}
      </Button>
      <ConfirmModal
        onConfirm={() => {
          deleteChapter();
        }}
      >
        <Button
          size={"sm"}
          disabled={isDeletePending || isTogglePublishChapterPending}
        >
          <Trash className=" h-4 w-4" />
        </Button>
      </ConfirmModal>
    </div>
  );
};

export default ChapterActions;
