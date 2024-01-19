import { z } from "zod";

import { PrismaClient, Score } from "@prisma/client";
import { procedure, router } from "@/server/trpc";
import { Result } from ".prisma/client";

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
      const result = await prisma.result.create({ data: opts.input });
      return {
        status: 201,
        message: `Result added successfully`,
        result,
      };
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
