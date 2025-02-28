/*
  Warnings:

  - You are about to drop the `Admin` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AttendanceReport` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Classroom` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ExamAttendance` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ExamDuty` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ExamSchedule` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Faculty` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Student` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Subject` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SubjectFaculty` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "role" AS ENUM ('ADMIN', 'FACULTY');

-- CreateEnum
CREATE TYPE "department" AS ENUM ('CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT');

-- CreateEnum
CREATE TYPE "dutystatus" AS ENUM ('ASSIGNED', 'CONFIRMED', 'COMPLETED', 'ABSENT');

-- CreateEnum
CREATE TYPE "attendancestatus" AS ENUM ('PRESENT', 'ABSENT', 'MALPRACTICE');

-- DropForeignKey
ALTER TABLE "Admin" DROP CONSTRAINT "Admin_userId_fkey";

-- DropForeignKey
ALTER TABLE "AttendanceReport" DROP CONSTRAINT "AttendanceReport_examDutyId_fkey";

-- DropForeignKey
ALTER TABLE "AttendanceReport" DROP CONSTRAINT "AttendanceReport_facultyId_fkey";

-- DropForeignKey
ALTER TABLE "ExamAttendance" DROP CONSTRAINT "ExamAttendance_examScheduleId_fkey";

-- DropForeignKey
ALTER TABLE "ExamAttendance" DROP CONSTRAINT "ExamAttendance_studentId_fkey";

-- DropForeignKey
ALTER TABLE "ExamAttendance" DROP CONSTRAINT "ExamAttendance_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "ExamDuty" DROP CONSTRAINT "ExamDuty_classroomId_fkey";

-- DropForeignKey
ALTER TABLE "ExamDuty" DROP CONSTRAINT "ExamDuty_examScheduleId_fkey";

-- DropForeignKey
ALTER TABLE "ExamDuty" DROP CONSTRAINT "ExamDuty_facultyId_fkey";

-- DropForeignKey
ALTER TABLE "ExamSchedule" DROP CONSTRAINT "ExamSchedule_classroomId_fkey";

-- DropForeignKey
ALTER TABLE "ExamSchedule" DROP CONSTRAINT "ExamSchedule_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "Faculty" DROP CONSTRAINT "Faculty_userId_fkey";

-- DropForeignKey
ALTER TABLE "SubjectFaculty" DROP CONSTRAINT "SubjectFaculty_facultyId_fkey";

-- DropForeignKey
ALTER TABLE "SubjectFaculty" DROP CONSTRAINT "SubjectFaculty_subjectId_fkey";

-- DropTable
DROP TABLE "Admin";

-- DropTable
DROP TABLE "AttendanceReport";

-- DropTable
DROP TABLE "Classroom";

-- DropTable
DROP TABLE "ExamAttendance";

-- DropTable
DROP TABLE "ExamDuty";

-- DropTable
DROP TABLE "ExamSchedule";

-- DropTable
DROP TABLE "Faculty";

-- DropTable
DROP TABLE "Student";

-- DropTable
DROP TABLE "Subject";

-- DropTable
DROP TABLE "SubjectFaculty";

-- DropTable
DROP TABLE "User";

-- DropEnum
DROP TYPE "AttendanceStatus";

-- DropEnum
DROP TYPE "Department";

-- DropEnum
DROP TYPE "DutyStatus";

-- DropEnum
DROP TYPE "Role";

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "role" NOT NULL DEFAULT 'FACULTY',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "faculty" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "department" "department" NOT NULL,
    "designation" TEXT NOT NULL,
    "contactNumber" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "faculty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student" (
    "id" TEXT NOT NULL,
    "registerNumber" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "department" "department" NOT NULL,
    "semester" INTEGER NOT NULL,
    "section" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subject" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "department" "department" NOT NULL,
    "semester" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subjectfaculty" (
    "id" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "facultyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subjectfaculty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "classroom" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "building" TEXT,
    "floor" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "classroom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "examschedule" (
    "id" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "classroomId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "examschedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "examduty" (
    "id" TEXT NOT NULL,
    "examScheduleId" TEXT NOT NULL,
    "facultyId" TEXT NOT NULL,
    "classroomId" TEXT NOT NULL,
    "status" "dutystatus" NOT NULL DEFAULT 'ASSIGNED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "examduty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "examattendance" (
    "id" TEXT NOT NULL,
    "examScheduleId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "status" "attendancestatus" NOT NULL DEFAULT 'ABSENT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "examattendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attendancereport" (
    "id" TEXT NOT NULL,
    "examDutyId" TEXT NOT NULL,
    "facultyId" TEXT NOT NULL,
    "present" INTEGER NOT NULL,
    "absent" INTEGER NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "attendancereport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "admin_userId_key" ON "admin"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "faculty_userId_key" ON "faculty"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "student_registerNumber_key" ON "student"("registerNumber");

-- CreateIndex
CREATE UNIQUE INDEX "subject_code_key" ON "subject"("code");

-- CreateIndex
CREATE UNIQUE INDEX "subjectfaculty_subjectId_facultyId_key" ON "subjectfaculty"("subjectId", "facultyId");

-- CreateIndex
CREATE UNIQUE INDEX "classroom_name_key" ON "classroom"("name");

-- CreateIndex
CREATE UNIQUE INDEX "examduty_examScheduleId_facultyId_key" ON "examduty"("examScheduleId", "facultyId");

-- CreateIndex
CREATE UNIQUE INDEX "examattendance_examScheduleId_studentId_key" ON "examattendance"("examScheduleId", "studentId");

-- CreateIndex
CREATE UNIQUE INDEX "attendancereport_examDutyId_key" ON "attendancereport"("examDutyId");

-- AddForeignKey
ALTER TABLE "admin" ADD CONSTRAINT "admin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "faculty" ADD CONSTRAINT "faculty_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subjectfaculty" ADD CONSTRAINT "subjectfaculty_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subjectfaculty" ADD CONSTRAINT "subjectfaculty_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "faculty"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "examschedule" ADD CONSTRAINT "examschedule_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "examschedule" ADD CONSTRAINT "examschedule_classroomId_fkey" FOREIGN KEY ("classroomId") REFERENCES "classroom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "examduty" ADD CONSTRAINT "examduty_examScheduleId_fkey" FOREIGN KEY ("examScheduleId") REFERENCES "examschedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "examduty" ADD CONSTRAINT "examduty_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "faculty"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "examduty" ADD CONSTRAINT "examduty_classroomId_fkey" FOREIGN KEY ("classroomId") REFERENCES "classroom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "examattendance" ADD CONSTRAINT "examattendance_examScheduleId_fkey" FOREIGN KEY ("examScheduleId") REFERENCES "examschedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "examattendance" ADD CONSTRAINT "examattendance_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "examattendance" ADD CONSTRAINT "examattendance_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendancereport" ADD CONSTRAINT "attendancereport_examDutyId_fkey" FOREIGN KEY ("examDutyId") REFERENCES "examduty"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendancereport" ADD CONSTRAINT "attendancereport_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "faculty"("id") ON DELETE CASCADE ON UPDATE CASCADE;
