import { mergeRouters } from "@/server/trpc";
import { studentRouter } from "@/server/routers/student";
import { courseRouter } from "@/server/routers/course";
import { resultRouter } from "@/server/routers/result";

export const appRouter = mergeRouters(
  studentRouter,
  courseRouter,
  resultRouter,
);
// export type definition of API
export type AppRouter = typeof appRouter;
