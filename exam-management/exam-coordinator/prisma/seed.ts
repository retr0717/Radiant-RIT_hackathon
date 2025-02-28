import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create faculty
  const faculty = await prisma.faculty.upsert({
    where: { id: "faculty-001" },
    update: {},
    create: {
      id: "faculty-001",
      name: "Dr. John Doe",
    },
  });

  // Create exam duties
  const examDuty1 = await prisma.examduty.create({
    data: {
      id: "exam-duty-001",
      dutyName: "Mid-Sem Exam Duty 1",
    },
  });

  const examDuty2 = await prisma.examduty.create({
    data: {
      id: "exam-duty-002",
      dutyName: "Final Exam Duty 1",
    },
  });

  // Create attendance reports
  await prisma.attendancereport.createMany({
    data: [
      {
        id: "report-001",
        examDutyId: examDuty1.id,
        facultyId: faculty.id,
        present: 45,
        absent: 5,
        notes: "Smooth session, no issues.",
      },
      {
        id: "report-002",
        examDutyId: examDuty2.id,
        facultyId: faculty.id,
        present: 40,
        absent: 10,
        notes: "Some students were late.",
      },
    ],
  });

  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
