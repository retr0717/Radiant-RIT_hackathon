"use client";

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Check, Search, Send, UserCheck, UserX } from 'lucide-react';
import { getExamCenters, getStudentsByExamCenter, markAttendance } from '@/lib/actions/attendance';

// Mock data for students
const generateStudents = (centerId: number) => {
  const students = [];
  const count = 10 + Math.floor(Math.random() * 5);
  
  for (let i = 1; i <= count; i++) {
    students.push({
      id: `${centerId}${i.toString().padStart(3, '0')}`,
      name: `Student ${i}`,
      rollNumber: `R${centerId}${i.toString().padStart(3, '0')}`,
      course: ["Computer Science", "Mathematics", "Physics", "Chemistry", "Biology"][Math.floor(Math.random() * 5)],
      present: Math.random() > 0.1, // 90% chance of being present by default
    });
  }
  
  return students;
};

export default function AttendancePage() {
  const [examCenters, setExamCenters] = useState<{ id: string; name: string }[]>([]);
  const [selectedCenter, setSelectedCenter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [students, setStudents] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchExamCenters() {
      const centers = await getExamCenters();
      setExamCenters(centers);
    }
    fetchExamCenters();
  }, []);

  const handleCenterChange = async (value: string) => {
    setSelectedCenter(value);
    const students = await getStudentsByExamCenter(value);
    setStudents(students);
  };

  const handleToggleAttendance = async (studentId: string, course: string) => {
    setStudents((prevStudents) =>
      prevStudents.map(student =>
        student.id === studentId ? { ...student, present: !student.present } : student
      )
    );

    await markAttendance(studentId, "faculty-id-placeholder", !students.find(s => s.id === studentId)?.present, course);
  };

  const handleMarkAllPresent = async () => {
    const updatedStudents = students.map(student => ({ ...student, present: true }));
    setStudents(updatedStudents);

    await Promise.all(
      updatedStudents.map(student => markAttendance(student.id, "faculty-id-placeholder", true, student.course))
    );

    toast({
      title: "All students marked present",
      description: `${students.length} students have been marked as present.`,
    });
  };

  const handleSubmitAttendance = async () => {
    setIsSubmitting(true);
    
    await Promise.all(
      students.map(student => markAttendance(student.id, "faculty-id-placeholder", student.present, student.course))
    );

    setIsSubmitting(false);
    toast({
      title: "Attendance submitted successfully",
      description: `Attendance for ${students.length} students has been shared with subject teachers.`,
    });
  };

  const filteredStudents = students.filter(student =>
    student.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.course.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const presentCount = students.filter(s => s.present).length;
  const absentCount = students.length - presentCount;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Attendance Management</h1>
          <p className="text-muted-foreground">Mark and track student attendance for exams</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select Exam Center</CardTitle>
          <CardDescription>
            Choose an exam center to view and manage student attendance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedCenter} onValueChange={handleCenterChange}>
            <SelectTrigger className="w-full md:w-[300px]">
              <SelectValue placeholder="Select an exam center" />
            </SelectTrigger>
            <SelectContent>
              {examCenters.map((center) => (
                <SelectItem key={center.id} value={center.id.toString()}>
                  {center.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedCenter && (
        <>
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Total Students</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{students.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-green-500" />
                  Present
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-500">{presentCount}</div>
                <p className="text-sm text-muted-foreground">
                  {students.length > 0 ? `${Math.round((presentCount / students.length) * 100)}%` : '0%'} of total
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <UserX className="h-5 w-5 text-red-500" />
                  Absent
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-500">{absentCount}</div>
                <p className="text-sm text-muted-foreground">
                  {students.length > 0 ? `${Math.round((absentCount / students.length) * 100)}%` : '0%'} of total
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle>Student Attendance</CardTitle>
                  <CardDescription>
                    Toggle attendance status for each student
                  </CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button 
                    variant="outline" 
                    onClick={handleMarkAllPresent}
                    className="flex items-center gap-2"
                  >
                    <Check className="h-4 w-4" />
                    Mark All Present
                  </Button>
                  <Button 
                    onClick={handleSubmitAttendance}
                    disabled={isSubmitting}
                    className="flex items-center gap-2"
                  >
                    <Send className="h-4 w-4" />
                    {isSubmitting ? "Submitting..." : "Submit Attendance"}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Label htmlFor="search" className="sr-only">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search by name, roll number, or course..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Roll Number</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Course</TableHead>
                      <TableHead className="text-center">Attendance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.length > 0 ? (
                      filteredStudents.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">{student.rollNumber}</TableCell>
                          <TableCell>{student.name}</TableCell>
                          <TableCell>{student.course}</TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center">
                              <Switch
                                checked={student.present}
                                onCheckedChange={() => handleToggleAttendance(student.id)}
                              />
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                          No students found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {filteredStudents.length} of {students.length} students
              </p>
              <Button 
                onClick={handleSubmitAttendance}
                disabled={isSubmitting}
                className="flex items-center gap-2"
              >
                <Send className="h-4 w-4" />
                {isSubmitting ? "Submitting..." : "Submit Attendance"}
              </Button>
            </CardFooter>
          </Card>
        </>
      )}
    </div>
  );
}