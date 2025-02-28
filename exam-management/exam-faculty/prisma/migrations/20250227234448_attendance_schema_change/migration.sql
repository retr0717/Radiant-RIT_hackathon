/*
  Warnings:

  - Added the required column `course` to the `attendance` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "attendance" ADD COLUMN     "course" TEXT NOT NULL;
