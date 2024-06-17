"use client";

import { useConfettiStore } from "@/hooks/use-confetti-store";
import { cn } from "@/lib/utils";
import MuxPlayer from "@mux/mux-player-react";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { Loader2, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { FC } from "react";
import toast from "react-hot-toast";

interface VideoPlayerProps {
  chapterId: string;
  title: string;
  courseId: string;
  nextChapterId?: string;
  playbackId: string;
  isLocked: boolean;
  completeOnEnd: boolean;
}
const VideoPlayer: FC<VideoPlayerProps> = ({
  chapterId,
  completeOnEnd,
  courseId,
  isLocked,
  nextChapterId,
  playbackId,
  title,
}) => {
  const [isReady, setIsReady] = React.useState(false);
  const router = useRouter();
  const confetti = useConfettiStore();

  const { mutate: markComplete } = useMutation({
    mutationFn: async () => {
      if (completeOnEnd) {
        await axios.put(
          `/api/courses/${courseId}/chapters/${chapterId}/progress`,
          {
            isCompleted: true,
          }
        );
      }

      return;
    },
    onSuccess: () => {
      if (!nextChapterId) {
        confetti.onOpen();
      }

      toast.success("Progress updated successfully.");
      router.refresh();

      if (nextChapterId) {
        router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
      }
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          return router.push("/sign-in");
        }
      }
    },
  });

  console.log("isLocked", isLocked);
  return (
    <div className=" relative aspect-video">
      {isLocked && (
        <div className=" absolute inset-0 flex items-center justify-center  bg-slate-800 flex-col gap-y-2 text-secondary">
          <Lock className="  h-8 w-8  " />
          <p className=" text-sm ">This chapter is locked.</p>
        </div>
      )}
      {!isLocked && !isReady && (
        <div className=" absolute inset-0 flex items-center justify-center  bg-slate-800">
          <Loader2 className="  h-8 w-8 animate-spin text-secondary" />
        </div>
      )}

      {!isLocked && (
        <MuxPlayer
          title={title}
          className={cn(!isReady && "hidden")}
          onCanPlay={() => setIsReady(true)}
          onEnded={() => {
            markComplete();
          }}
          autoPlay
          playbackId={playbackId}
        />
      )}
    </div>
  );
};

export default VideoPlayer;
