"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

// Dummy Data
const dummyReports = [
    {
      id: "report-001",
      examDuty: { id: "Exam Duty 1" },
      faculty: { id: "Dr. John Doe" },
      date: "2025-02-28",
      present: 45,
      absent: 5,
      totalStudents: 50,
      notes: "Smooth session, no issues.",
      comments: ["Well managed.", "No late students."],
    },
    {
      id: "report-002",
      examDuty: { id: "Exam Duty 2" },
      faculty: { id: "Dr. Jane Smith" },
      date: "2025-02-27",
      present: 40,
      absent: 10,
      totalStudents: 50,
      notes: "Some students were late.",
      comments: ["Need stricter time enforcement.", "10 students were absent."],
    },
    {
      id: "report-003",
      examDuty: { id: "Exam Duty 3" },
      faculty: { id: "Dr. Alex Brown" },
      date: "2025-02-26",
      present: 50,
      absent: 2,
      totalStudents: 52,
      notes: "Attendance was well managed.",
      comments: ["Very smooth session.", "Minimal absentees."],
    },
  ];
  

export default function ReportDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [report, setReport] = useState(null);

  useEffect(() => {
    const foundReport = dummyReports.find((r) => r.id === params.id);
    if (foundReport) {
      setReport(foundReport);
    }
  }, [params.id]);

  if (!report) {
    return <p className="text-center text-white">Loading report...</p>;
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <Button variant="outline" className="mb-4 border-gray-300 text-white" onClick={() => router.push("/dashboard/attendance")}>
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Reports
      </Button>
      <Card className="border border-gray-300 bg-gray-900 text-white">
        <CardHeader>
          <CardTitle className="text-2xl">Exam Duty: {report.examDuty.id}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-lg">Faculty: {report.faculty.id}</p>
          <p className="text-lg">Date: {report.date}</p>
          <p className="text-lg">Total Students: {report.totalStudents}</p>
          <p className="text-lg">Present: {report.present}</p>
          <p className="text-lg">Absent: {report.absent}</p>
          <p className="italic text-gray-400">Notes: {report.notes || "No additional notes."}</p>
          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-2">Comments:</h2>
            {report.comments.length > 0 ? (
              <ul className="list-disc pl-5">
                {report.comments.map((comment, index) => (
                  <li key={index} className="text-gray-300">{comment}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400">No comments available.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
