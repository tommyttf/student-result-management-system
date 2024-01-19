import { z, ZodDate, ZodString } from "zod";
import { sub } from "date-fns";

import { Prisma, PrismaClient } from "@prisma/client";
import { procedure, router } from "@/server/trpc";
import { TRPCError } from "@trpc/server";

const prisma = new PrismaClient();
export const studentRouter = router({
  addNewStudent: procedure
    .input(
      z.object<{
        firstName: ZodString;
        familyName: ZodString;
        dateOfBirth: ZodDate;
        email: ZodString;
      }>({
        firstName: z.string(),
        familyName: z.string(),
        dateOfBirth: z.date().max(sub(new Date(), { years: 10 })),
        email: z.string().email(),
      }),
    )
    .mutation(async (opts) => {
      try {
        const result = await prisma.student.create({ data: opts.input });
        return {
          status: 201,
          message: `Student with email "${result.email}" added successfully`,
          result,
        };
      } catch (err) {
        if (
          err instanceof Prisma.PrismaClientKnownRequestError &&
          err.code === "P2002"
        ) {
          throw new TRPCError({
            code: "CONFLICT",
            message: `Student with email "${opts.input.email}" already exist.`,
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
});
