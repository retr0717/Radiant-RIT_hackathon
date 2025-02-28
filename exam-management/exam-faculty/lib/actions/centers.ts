"use server"

import {prisma} from "@/lib/prisma";

// Fetch all exam centers
export async function getExamCenters() {
  try {
    const examCenters = await prisma.examCenter.findMany();
    return { success: true, data: examCenters };
  } catch (error) {
    console.error("Error fetching exam centers:", error);
    return { success: false, error: "Failed to fetch exam centers." };
  }
}

// Fetch a single exam center by ID
export async function getExamCenterById(id : any) {
  try {
    const examCenter = await prisma.examCenter.findUnique({
      where: { id },
    });
    if (!examCenter) {
      return { success: false, error: "Exam center not found." };
    }
    return { success: true, data: examCenter };
  } catch (error) {
    console.error("Error fetching exam center:", error);
    return { success: false, error: "Failed to fetch exam center." };
  }
}

// Add a new exam center
export async function addExamCenter(data : any) {
  try {
    const newExamCenter = await prisma.examCenter.create({
      data,
    });
    return { success: true, data: newExamCenter };
  } catch (error) {
    console.error("Error adding exam center:", error);
    return { success: false, error: "Failed to add exam center." };
  }
}

// Update an existing exam center
export async function updateExamCenter(id : any, data : any) {
  try {
    const updatedExamCenter = await prisma.examCenter.update({
      where: { id },
      data,
    });
    return { success: true, data: updatedExamCenter };
  } catch (error) {
    console.error("Error updating exam center:", error);
    return { success: false, error: "Failed to update exam center." };
  }
}

// Delete an exam center
export async function deleteExamCenter(id: any) {
  try {
    await prisma.examCenter.delete({
      where: { id },
    });
    return { success: true, message: "Exam center deleted successfully." };
  } catch (error) {
    console.error("Error deleting exam center:", error);
    return { success: false, error: "Failed to delete exam center." };
  }
}