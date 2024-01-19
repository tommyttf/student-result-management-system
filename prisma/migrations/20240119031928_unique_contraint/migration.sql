/*
  Warnings:

  - A unique constraint covering the columns `[name,isDeleted]` on the table `Course` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[courseId,studentId]` on the table `Result` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email,isDeleted]` on the table `Student` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Course_name_isDeleted_key` ON `Course`(`name`, `isDeleted`);

-- CreateIndex
CREATE UNIQUE INDEX `Result_courseId_studentId_key` ON `Result`(`courseId`, `studentId`);

-- CreateIndex
CREATE UNIQUE INDEX `Student_email_isDeleted_key` ON `Student`(`email`, `isDeleted`);
