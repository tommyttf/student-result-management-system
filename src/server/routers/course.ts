import { z } from "zod";

import { Course, PrismaClient } from "@prisma/client";
import { procedure, router } from "@/server/trpc";

const prisma = new PrismaClient();
export const courseRouter = router({
  // course api
  addNewCourse: procedure
    .input(
      z.object<Course>({
        name: z.string(),
      }),
    )
    .mutation(async (opts) => {
      const result = await prisma.course.create({ data: opts.input });
      return {
        status: 201,
        message: `Course with name "${result.name}" added successfully`,
        result,
      };
    }),
  getAllCourses: procedure.query(() =>
    prisma.course.findMany({
      select: {
        id: true,
        name: true,
      },
      where: {
        isDeleted: false,
      },
    }),
  ),
  deleteCourse: procedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async (opts) => {
      const id = opts.input.id;
      const result = await prisma.course.update({
        where: {
          id,
        },
        data: {
          isDeleted: true,
          deletedAt: new Date(),
        },
      });

      return {
        status: 201,
        message: `Course with name "${result.name}" deleted successfully`,
        result,
      };
    }),
});
