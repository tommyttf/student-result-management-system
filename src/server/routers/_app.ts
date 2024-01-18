import { z } from "zod";
import { procedure, router } from "../trpc";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const appRouter = router({
  getAllStudents: procedure.query(() =>
    prisma.student.findMany({
      select: {
        id: true,
        firstName: true,
        familyName: true,
        dateOfBirth: true,
        email: true,
      },
      where: {
        isDeleted: false,
      },
    }),
  ),
  deleteStudent: procedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async (opts) => {
      const id = opts.input.id;
      const result = await prisma.student.update({
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
        message: `Student with id ${id} deleted successfully`,
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
        message: `Course with id ${id} deleted successfully`,
        result,
      };
    }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
