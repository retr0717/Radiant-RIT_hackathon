"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { CalendarDays, ClipboardCheck, School, Users } from "lucide-react";

export default function DashboardPage() {
  // Mock data for attendance statistics
  const attendanceData = [
    { name: "Computer Science", present: 45, absent: 5 },
    { name: "Mathematics", present: 38, absent: 7 },
    { name: "Physics", present: 42, absent: 3 },
    { name: "Chemistry", present: 35, absent: 10 },
    { name: "Biology", present: 40, absent: 5 },
  ];

  // Mock data for exam center distribution
  const examCenterData = [
    { name: "Center A", value: 35 },
    { name: "Center B", value: 25 },
    { name: "Center C", value: 20 },
    { name: "Center D", value: 15 },
    { name: "Center E", value: 5 },
  ];

  const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

  // Mock data for overview cards
  const overviewData = [
    {
      title: "Total Students",
      value: "1,245",
      icon: Users,
      description: "Registered for exams",
    },
    {
      title: "Exam Centers",
      value: "12",
      icon: School,
      description: "Available centers",
    },
    {
      title: "Attendance Rate",
      value: "92%",
      icon: ClipboardCheck,
      description: "Average across all exams",
    },
    {
      title: "Upcoming Exams",
      value: "8",
      icon: CalendarDays,
      description: "In the next 7 days",
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="text-muted-foreground">Welcome back, Professor. Here's an overview of the exam status.</p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {overviewData.map((item, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {item.title}
              </CardTitle>
              <item.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.value}</div>
              <p className="text-xs text-muted-foreground">
                {item.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Attendance Statistics</CardTitle>
            <CardDescription>
              Present vs. absent students by subject
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={attendanceData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="present" fill="hsl(var(--chart-1))" name="Present" />
                  <Bar dataKey="absent" fill="hsl(var(--chart-3))" name="Absent" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Exam Center Distribution</CardTitle>
            <CardDescription>
              Students allocated per exam center
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={examCenterData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {examCenterData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}