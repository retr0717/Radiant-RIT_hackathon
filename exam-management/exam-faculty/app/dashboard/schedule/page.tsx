"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEffect, useState } from "react";
import { format, isSameDay } from "date-fns";
import { getExamSchedules } from "@/lib/actions/exam";

// Mock data for exam schedule
const examSchedule = [
  {
    id: 1,
    subject: "Computer Science",
    date: new Date(2025, 4, 10), // May 10, 2025
    startTime: "09:00 AM",
    endTime: "12:00 PM",
    center: "University Main Campus",
    students: 45,
  },
  {
    id: 2,
    subject: "Mathematics",
    date: new Date(2025, 4, 12), // May 12, 2025
    startTime: "02:00 PM",
    endTime: "05:00 PM",
    center: "Science Building",
    students: 38,
  },
  {
    id: 3,
    subject: "Physics",
    date: new Date(2025, 4, 15), // May 15, 2025
    startTime: "09:00 AM",
    endTime: "12:00 PM",
    center: "Engineering Complex",
    students: 42,
  },
  {
    id: 4,
    subject: "Chemistry",
    date: new Date(2025, 4, 18), // May 18, 2025
    startTime: "02:00 PM",
    endTime: "05:00 PM",
    center: "Science Building",
    students: 35,
  },
  {
    id: 5,
    subject: "Biology",
    date: new Date(2025, 4, 20), // May 20, 2025
    startTime: "09:00 AM",
    endTime: "12:00 PM",
    center: "Medical Sciences Building",
    students: 40,
  },
  {
    id: 6,
    subject: "English Literature",
    date: new Date(2025, 4, 22), // May 22, 2025
    startTime: "02:00 PM",
    endTime: "05:00 PM",
    center: "Arts & Humanities Center",
    students: 32,
  },
  {
    id: 7,
    subject: "Economics",
    date: new Date(2025, 4, 25), // May 25, 2025
    startTime: "09:00 AM",
    endTime: "12:00 PM",
    center: "Business School",
    students: 37,
  },
];

export default function SchedulePage() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const data = await getExamSchedules();
      console.log("data : ", data);
      setSchedules(data);
    }
    fetchData();
  }, []);
  
  // Function to highlight dates with exams
  const isDayWithExam = (day: Date) => {
    return examSchedule.some(exam => isSameDay(day, exam.date));
  };

  // Filter exams for the selected date
  const examsForSelectedDate = date 
    ? examSchedule.filter(exam => isSameDay(exam.date, date))
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Exam Schedule</h1>
        <p className="text-muted-foreground">View and manage upcoming exam schedules</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Calendar View</CardTitle>
            <CardDescription>
              Select a date to view scheduled exams
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
              modifiers={{
                hasExam: (date) => isDayWithExam(date),
              }}
              modifiersClassNames={{
                hasExam: "bg-primary/20 font-bold",
              }}
              components={{
                DayContent: (props) => (
                  <div className="relative">
                    {props.date && isDayWithExam(props.date) && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                    )}
                    <div>{props.date.getDate()}</div>
                  </div>
                ),
              }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              {date ? format(date, "MMMM d, yyyy") : "No date selected"}
            </CardTitle>
            <CardDescription>
              {examsForSelectedDate.length > 0 
                ? `${examsForSelectedDate.length} exam${examsForSelectedDate.length > 1 ? 's' : ''} scheduled`
                : "No exams scheduled for this date"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {examsForSelectedDate.length > 0 ? (
              <div className="space-y-4">
                {examsForSelectedDate.map((exam) => (
                  <div key={exam.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg">{exam.subject}</h3>
                      <Badge>{exam.startTime} - {exam.endTime}</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">
                      {exam.center}
                    </div>
                    <div className="text-sm">
                      {exam.students} students registered
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-40 text-muted-foreground">
                {date ? "No exams scheduled for this date" : "Select a date to view exams"}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Complete Exam Schedule</CardTitle>
          <CardDescription>
            Overview of all upcoming exams
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Center</TableHead>
                <TableHead className="text-right">Students</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schedules.map((exam) => (
                <TableRow key={exam.id}>
                  <TableCell className="font-medium">{exam.subject}</TableCell>
                  <TableCell>{format(exam.date, "MMM d, yyyy")}</TableCell>
                  <TableCell>{exam?.duration}</TableCell>
                  <TableCell>{exam?.center}</TableCell>
                  <TableCell className="text-right">{exam.students}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}