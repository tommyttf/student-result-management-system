import { z } from "zod";

import { Course, PrismaClient } from "@prisma/client";
import { procedure, router } from "@/server/trpc";
import { PrismaClientKnownRequestError } from ".prisma/client";
import { TRPCError } from "@trpc/server";

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
      try {
        const result = await prisma.course.create({ data: opts.input });
        return {
          status: 201,
          message: `Course with name "${result.name}" added successfully`,
          result,
        };
      } catch (err) {
        if (
          err instanceof PrismaClientKnownRequestError &&
          err.code === "P2002"
        ) {
          throw new TRPCError({
            code: "CONFLICT",
            message: `Course "${opts.input.name}" already exist.`,
            cause: err,
          });
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred, please try again later.",
          cause: err,
        });
      }
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
