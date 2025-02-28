import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, Calendar, ClipboardList } from "lucide-react";

async function getStats() {
  const studentsCount = await prisma.student.count();
  const facultyCount = await prisma.faculty.count();
  const subjectsCount = await prisma.subject.count();
  const upcomingExams = await prisma.examschedule.count({
    where: {
      date: {
        gte: new Date(),
      },
    },
  });

  return {
    studentsCount,
    facultyCount,
    subjectsCount,
    upcomingExams,
  };
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/login");
  }

  const stats = await getStats();
  //@ts-ignore
  const isAdmin = session.user?.isAdmin;
  const userName = session.user?.name || "User";

  return (
    <div>
      <div className="flex flex-col gap-4 md:gap-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {userName}!
          </p>
        </div>

        {isAdmin && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Students
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.studentsCount}</div>
                <p className="text-xs text-muted-foreground">
                  Registered in the system
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Faculty Members
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.facultyCount}</div>
                <p className="text-xs text-muted-foreground">
                  Active faculty members
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Subjects
                </CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.subjectsCount}</div>
                <p className="text-xs text-muted-foreground">
                  Available in curriculum
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Upcoming Exams
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.upcomingExams}</div>
                <p className="text-xs text-muted-foreground">
                  Scheduled exams
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>
                Overview of your recent exam activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isAdmin ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 rounded-lg border p-4">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Calendar className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">New exam scheduled</p>
                      <p className="text-xs text-muted-foreground">
                        Data Structures exam scheduled for CSE department
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground">2h ago</div>
                  </div>
                  <div className="flex items-center gap-4 rounded-lg border p-4">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Users className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">Faculty assigned</p>
                      <p className="text-xs text-muted-foreground">
                        5 faculty members assigned to upcoming exams
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground">5h ago</div>
                  </div>
                  <div className="flex items-center gap-4 rounded-lg border p-4">
                    <div className="rounded-full bg-primary/10 p-2">
                      <ClipboardList className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">Attendance report</p>
                      <p className="text-xs text-muted-foreground">
                        Attendance report submitted for Database Systems exam
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground">1d ago</div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 rounded-lg border p-4">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Calendar className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">Upcoming duty</p>
                      <p className="text-xs text-muted-foreground">
                        You have an exam duty scheduled for tomorrow
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground">1d ahead</div>
                  </div>
                  <div className="flex items-center gap-4 rounded-lg border p-4">
                    <div className="rounded-full bg-primary/10 p-2">
                      <ClipboardList className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">Attendance pending</p>
                      <p className="text-xs text-muted-foreground">
                        Attendance report pending for yesterday's exam
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground">Due today</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Frequently used actions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {isAdmin ? (
                <>
                  <a href="/dashboard/students/add" className="block w-full">
                    <div className="rounded-md border border-border p-3 hover:bg-secondary transition-colors">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">Add Student</span>
                      </div>
                    </div>
                  </a>
                  <a href="/dashboard/faculty/add" className="block w-full">
                    <div className="rounded-md border border-border p-3 hover:bg-secondary transition-colors">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">Add Faculty</span>
                      </div>
                    </div>
                  </a>
                  <a href="/dashboard/exams/schedule" className="block w-full">
                    <div className="rounded-md border border-border p-3 hover:bg-secondary transition-colors">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">Schedule Exam</span>
                      </div>
                    </div>
                  </a>
                </>
              ) : (
                <>
                  <a href="/dashboard/attendance/submit" className="block w-full">
                    <div className="rounded-md border border-border p-3 hover:bg-secondary transition-colors">
                      <div className="flex items-center gap-2">
                        <ClipboardList className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">Submit Attendance</span>
                      </div>
                    </div>
                  </a>
                  <a href="/dashboard/attendance/view" className="block w-full">
                    <div className="rounded-md border border-border p-3 hover:bg-secondary transition-colors">
                      <div className="flex items-center gap-2">
                        <ClipboardList className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">View Reports</span>
                      </div>
                    </div>
                  </a>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}