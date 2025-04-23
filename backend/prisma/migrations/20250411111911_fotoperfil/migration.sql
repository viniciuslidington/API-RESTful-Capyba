/*
  Warnings:

  - You are about to drop the column `profilepic` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "profilepic",
ADD COLUMN     "image" TEXT;
