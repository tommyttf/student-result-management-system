import { z } from "zod";
import { procedure, router } from "../trpc";

import { Course, PrismaClient, Student } from "@prisma/client";
import { sub } from "date-fns";

const prisma = new PrismaClient();

export const appRouter = router({
  // student api
  addNewStudent: procedure
    .input(
      z.object<Student>({
        firstName: z.string(),
        familyName: z.string(),
        dateOfBirth: z.date().max(sub(new Date(), { years: 10 })),
        email: z.string().email(),
      }),
    )
    .mutation(async (opts) => {
      const result = await prisma.student.create({ data: opts.input });
      return {
        status: 201,
        message: `Student with email "${result.email}" added successfully`,
        result,
      };
    }),
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
        message: `Student with email "${result.email}" deleted successfully`,
        result,
      };
    }),
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
// export type definition of API
export type AppRouter = typeof appRouter;
