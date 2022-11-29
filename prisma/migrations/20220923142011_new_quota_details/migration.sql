/*
  Warnings:

  - You are about to drop the `emails` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "emails" DROP CONSTRAINT "emails_senderId_fkey";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "lastMailDate" TIMESTAMP(3),
ADD COLUMN     "usedQuota" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "emails";
