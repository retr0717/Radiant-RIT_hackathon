"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye } from "lucide-react";

// Dummy Data
const dummyReports = [
  {
    id: "report-001",
    examDuty: { id: "Exam Duty 1" },
    faculty: { id: "Dr. John Doe" },
    present: 45,
    absent: 5,
    notes: "Smooth session, no issues.",
  },
  {
    id: "report-002",
    examDuty: { id: "Exam Duty 2" },
    faculty: { id: "Dr. Jane Smith" },
    present: 40,
    absent: 10,
    notes: "Some students were late.",
  },
  {
    id: "report-003",
    examDuty: { id: "Exam Duty 3" },
    faculty: { id: "Dr. Alex Brown" },
    present: 50,
    absent: 2,
    notes: "Attendance was well managed.",
  },
];

export default function AttendancePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [reports, setReports] = useState([]);

  useEffect(() => {
    // if (status === "loading") return;
    // if (!session || !session.user?.isAdmin) {
    //   router.push("/dashboard");
    // } else {
      setReports(dummyReports); // Replace with API call when ready
    //}
  }, [session, status, router]);

  if (status === "loading") {
    return <p className="text-center text-white">Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center">Exam Attendance Reports</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.length === 0 ? (
          <p className="text-center col-span-full">No attendance reports found.</p>
        ) : (
          reports.map((report) => (
            <Card key={report.id} className="border border-gray-300 bg-gray-900 text-white">
              <CardHeader>
                <CardTitle className="text-lg">Exam Duty: {report.examDuty.id}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p>Faculty: {report?.faculty?.id}</p>
                <p>Present: {report?.present}</p>
                <p>Absent: {report?.absent}</p>
                <p className="italic text-sm text-gray-400">{report.notes || "No additional notes."}</p>
                <Link href={`/dashboard/attendance/${report.id}`}>
                  <Button variant="outline" className="w-full border-gray-300 text-white">
                    <Eye className="h-4 w-4 mr-2" /> View Details
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}