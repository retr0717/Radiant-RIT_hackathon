/*
  Warnings:

  - You are about to drop the column `userId` on the `admin` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `faculty` table. All the data in the column will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[usersId]` on the table `admin` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[usersId]` on the table `faculty` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `usersId` to the `admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usersId` to the `faculty` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "admin" DROP CONSTRAINT "admin_userId_fkey";

-- DropForeignKey
ALTER TABLE "faculty" DROP CONSTRAINT "faculty_userId_fkey";

-- DropIndex
DROP INDEX "admin_userId_key";

-- DropIndex
DROP INDEX "faculty_userId_key";

-- AlterTable
ALTER TABLE "admin" DROP COLUMN "userId",
ADD COLUMN     "usersId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "faculty" DROP COLUMN "userId",
ADD COLUMN     "usersId" TEXT NOT NULL;

-- DropTable
DROP TABLE "user";

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "role" NOT NULL DEFAULT 'FACULTY',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "admin_usersId_key" ON "admin"("usersId");

-- CreateIndex
CREATE UNIQUE INDEX "faculty_usersId_key" ON "faculty"("usersId");

-- AddForeignKey
ALTER TABLE "admin" ADD CONSTRAINT "admin_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "faculty" ADD CONSTRAINT "faculty_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
