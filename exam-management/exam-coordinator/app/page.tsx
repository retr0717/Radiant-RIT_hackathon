import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GraduationCap, Calendar, Users, ClipboardList } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      <header className="container mx-auto py-6 px-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold">ExamManager</h1>
        </div>
        <div className="flex gap-4">
          <Link href="/login">
            <Button variant="outline">Login</Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            College Exam Management System
          </h1>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Streamline your exam coordination process with our comprehensive management system designed for college administrators and faculty.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button size="lg" className="w-full sm:w-auto">
                Get Started
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-24">
          <div className="bg-card rounded-lg p-6 shadow-lg border border-border">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Exam Scheduling</h3>
            <p className="text-muted-foreground">
              Create and manage exam schedules, assign classrooms, and organize timetables efficiently.
            </p>
          </div>
          
          <div className="bg-card rounded-lg p-6 shadow-lg border border-border">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Student Management</h3>
            <p className="text-muted-foreground">
              Register students, organize them by department and semester, and assign them to exam centers.
            </p>
          </div>
          
          <div className="bg-card rounded-lg p-6 shadow-lg border border-border">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <ClipboardList className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Attendance Tracking</h3>
            <p className="text-muted-foreground">
              Track student attendance, generate reports, and share information with faculty members.
            </p>
          </div>
        </div>
      </main>

      <footer className="border-t border-border mt-24 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2025 ExamManager. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}