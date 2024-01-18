/*
  Warnings:

  - You are about to alter the column `score` on the `Result` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.

*/
-- AlterTable
ALTER TABLE `Result` MODIFY `score` ENUM('A', 'B', 'C', 'D', 'E', 'F') NOT NULL;
