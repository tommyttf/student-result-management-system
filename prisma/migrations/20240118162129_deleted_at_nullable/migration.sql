-- AlterTable
ALTER TABLE `Course` MODIFY `deletedAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `Student` MODIFY `deletedAt` DATETIME(3) NULL;
