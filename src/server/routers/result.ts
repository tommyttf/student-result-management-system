import { z, ZodNativeEnum, ZodNumber } from "zod";

import { Prisma, PrismaClient, Score } from "@prisma/client";
import { procedure, router } from "@/server/trpc";
import { TRPCError } from "@trpc/server";
import { $Enums } from ".prisma/client";

const prisma = new PrismaClient();
export const resultRouter = router({
  addNewResult: procedure
    .input(
      z.object<{
        courseId: ZodNumber;
        studentId: ZodNumber;
        score: ZodNativeEnum<typeof $Enums.Score>;
      }>({
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
          err instanceof Prisma.PrismaClientKnownRequestError &&
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
