-- AlterTable
ALTER TABLE "examcenter" ADD COLUMN     "available" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "room" TEXT NOT NULL DEFAULT 'LH';
