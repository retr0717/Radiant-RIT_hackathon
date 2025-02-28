"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";

const studentSchema = z.object({
  registerNumber: z.string().min(3, {
    message: "Register number must be at least 3 characters.",
  }),
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  department: z.enum(["CSE", "ECE", "EEE", "MECH", "CIVIL", "IT"], {
    required_error: "Please select a department.",
  }),
  semester: z.coerce.number().min(1).max(8),
  section: z.string().optional(),
});

export async function addStudent(data: z.infer<typeof studentSchema>) {
  const validatedData = studentSchema.safeParse(data);

  if (!validatedData.success) {
    return { success: false, error: validatedData.error.format() };
  }

  try {
    await prisma.student.create({
      data: validatedData.data,
    });

    return { success: true };
  } catch (error) {
    console.error("Error adding student:", error);
    return { success: false, error: "Failed to add student" };
  }
}
