import { z } from "zod";
import { sub } from "date-fns";

import { PrismaClient, Student } from "@prisma/client";
import { procedure, router } from "@/server/trpc";

const prisma = new PrismaClient();
export const studentRouter = router({
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
});
