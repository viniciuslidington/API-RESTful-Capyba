/*
  Warnings:

  - You are about to drop the column `completed` on the `LearningItem` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `LearningItem` table. All the data in the column will be lost.
  - You are about to drop the column `validemail` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "LearningItem" DROP CONSTRAINT "LearningItem_userId_fkey";

-- AlterTable
ALTER TABLE "LearningItem" DROP COLUMN "completed",
DROP COLUMN "userId",
ADD COLUMN     "public" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "validemail",
ADD COLUMN     "emailVerified" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "UserLearningItem" (
    "userId" INTEGER NOT NULL,
    "learningItemId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserLearningItem_pkey" PRIMARY KEY ("userId","learningItemId")
);

-- AddForeignKey
ALTER TABLE "UserLearningItem" ADD CONSTRAINT "UserLearningItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLearningItem" ADD CONSTRAINT "UserLearningItem_learningItemId_fkey" FOREIGN KEY ("learningItemId") REFERENCES "LearningItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
