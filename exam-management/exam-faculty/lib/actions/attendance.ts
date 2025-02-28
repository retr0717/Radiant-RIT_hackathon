// actions.ts
"use server"
import {prisma} from "@/lib/prisma";

export async function getExamCenters() {
  return await prisma.examCenter.findMany();
}

export async function getStudentsByExamCenter(examCenterId: string) {
  return await prisma.student.findMany({
    where: {
      ExamCenter: {
        some: {
          id: examCenterId,
        },
      },
    },
    include: {
      Attendance: true,
    },
  });
}

export async function markAttendance(studentId: string, facultyId: string, present: boolean, course: string) {
  return await prisma.attendance.upsert({
    where: { studentId },
    update: { present },
    create: {
      studentId,
      facultyId,
      present,
      course,
    },
  });
}