"use server"

import prisma from "@/lib/prisma";

// Fetch all Exam Schedules with Centers
export async function getExamSchedules() {
  try {
    const schedules = await prisma.examSchedule.findMany({
      include: {
        centers: true, // Include related Exam Centers
      },
      orderBy: {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
        date: "asc",
      },
    });

    console.log("schedules: ", schedules);

    return schedules;
  } catch (error) {
    console.error("Error fetching exam schedules:", error);
    return [];
  }
}

// Fetch a single Exam Schedule by ID (with Centers)
export async function getExamScheduleById(scheduleId: string) {
  try {
    const schedule = await prisma.examSchedule.findUnique({
      where: { id: scheduleId },
      include: {
        centers: true, // Include related Exam Centers
      },
    });

    return schedule;
  } catch (error) {
    console.error("Error fetching exam schedule:", error);
    return null;
  }
}

// Fetch all Exam Centers with their Schedules
export async function getExamCenters() {
  try {
    const centers = await prisma.examCenter.findMany({
      include: {
        schedule: true, // Include the Exam Schedule it belongs to
      },
      orderBy: {
        name: "asc",
      },
    });

    return centers;
  } catch (error) {
    console.error("Error fetching exam centers:", error);
    return [];
  }
}


async function testDB() {
    const centers = await prisma.examCenter.findMany();
    console.log("Exam Centers from DB:", centers);
  }
  
  testDB();