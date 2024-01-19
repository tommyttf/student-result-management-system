import { z } from "zod";

import { PrismaClient, Score } from "@prisma/client";
import { procedure, router } from "@/server/trpc";
import { PrismaClientKnownRequestError, Result } from ".prisma/client";
import { TRPCError } from "@trpc/server";

const prisma = new PrismaClient({
  log: ["query"],
});
export const resultRouter = router({
  addNewResult: procedure
    .input(
      z.object<Result>({
        courseId: z.number(),
        studentId: z.number(),
        score: z.nativeEnum(Score),
      }),
    )
    .mutation(async (opts) => {
      try {
        const result = await prisma.result.create({ data: opts.input });
        return {
          status: 201,
          message: `Result added successfully`,
          result,
        };
      } catch (err) {
        if (
          err instanceof PrismaClientKnownRequestError &&
          err.code === "P2002"
        ) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Course result of the student already exist.",
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
  getAllResults: procedure.query(() =>
    prisma.result.findMany({
      select: {
        id: true,
        course: {
          select: {
            name: true,
          },
        },
        student: {
          select: {
            firstName: true,
            familyName: true,
          },
        },
        score: true,
      },
      where: {
        course: {
          isDeleted: false,
        },
        student: {
          isDeleted: false,
        },
      },
    }),
  ),
});
