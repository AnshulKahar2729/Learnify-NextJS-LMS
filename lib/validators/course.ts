import { z } from "zod";

export const CourseTitleValidator = z.object({
  title: z.string().min(1, {
    message: "Title is required",
  }),
});

export type CourseTitlePayload = z.infer<typeof CourseTitleValidator>;