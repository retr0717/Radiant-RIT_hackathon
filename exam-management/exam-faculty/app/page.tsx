import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, ClipboardCheck, School } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground py-6">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Exam Automation System</h1>
            <Link href="/login">
              <Button variant="secondary">Login</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <section className="mb-16 text-center">
          <h2 className="text-4xl font-bold mb-4">Streamline Your Exam Management</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A comprehensive solution for faculty to manage exam centers, track student attendance, and share information with subject teachers.
          </p>
        </section>

        {/* Cards Section */}
        <section className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Exam Center Selection Card */}
          <Card>
            <CardHeader>
              <School className="h-12 w-12 mb-2 text-primary" />
              <CardTitle>Exam Center Selection</CardTitle>
              <CardDescription>Choose from available exam centers based on your preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Faculty can select their preferred exam centers from an interactive map or list view, with real-time availability updates.</p>
            </CardContent>
            <CardFooter>
              <Link href="/login" className="w-full">
                <Button className="w-full">Get Started</Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Attendance Management Card */}
          <Card>
            <CardHeader>
              <ClipboardCheck className="h-12 w-12 mb-2 text-primary" />
              <CardTitle>Attendance Management</CardTitle>
              <CardDescription>Mark and track student attendance with ease</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Efficiently mark student attendance with intuitive toggle buttons and get a comprehensive overview of present and absent students.</p>
            </CardContent>
            <CardFooter>
              <Link href="/login" className="w-full">
                <Button className="w-full">Get Started</Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Information Sharing Card */}
          <Card>
            <CardHeader>
              <BookOpen className="h-12 w-12 mb-2 text-primary" />
              <CardTitle>Information Sharing</CardTitle>
              <CardDescription>Share attendance data with subject teachers</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Automatically share attendance records with relevant subject teachers, ensuring everyone has access to up-to-date information.</p>
            </CardContent>
            <CardFooter>
              <Link href="/login" className="w-full">
                <Button className="w-full">Get Started</Button>
              </Link>
            </CardFooter>
          </Card>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-muted py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">© {new Date().getFullYear()} Exam Automation System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}