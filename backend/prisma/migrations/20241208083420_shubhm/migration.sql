/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Connection` table. All the data in the column will be lost.
  - You are about to drop the column `menteeId` on the `Connection` table. All the data in the column will be lost.
  - You are about to drop the column `mentorId` on the `Connection` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Connection` table. All the data in the column will be lost.
  - You are about to drop the column `bio` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `interests` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `skills` on the `User` table. All the data in the column will be lost.
  - Added the required column `receiverId` to the `Connection` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senderId` to the `Connection` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Connection" DROP CONSTRAINT "Connection_menteeId_fkey";

-- DropForeignKey
ALTER TABLE "Connection" DROP CONSTRAINT "Connection_mentorId_fkey";

-- AlterTable
ALTER TABLE "Connection" DROP COLUMN "createdAt",
DROP COLUMN "menteeId",
DROP COLUMN "mentorId",
DROP COLUMN "status",
ADD COLUMN     "receiverId" INTEGER NOT NULL,
ADD COLUMN     "senderId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "bio",
DROP COLUMN "createdAt",
DROP COLUMN "interests",
DROP COLUMN "skills";

-- AddForeignKey
ALTER TABLE "Connection" ADD CONSTRAINT "Connection_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Connection" ADD CONSTRAINT "Connection_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
