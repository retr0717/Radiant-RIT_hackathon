"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  GraduationCap,
  LayoutDashboard,
  Users,
  UserCog,
  Calendar,
  BookOpen,
  ClipboardList,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useSession } from "next-auth/react";

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  adminOnly?: boolean;
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    title: "Students",
    href: "/dashboard/students",
    icon: <Users className="h-5 w-5" />,
    adminOnly: true,
  },
  {
    title: "Faculty",
    href: "/dashboard/faculty",
    icon: <UserCog className="h-5 w-5" />,
    adminOnly: true,
  },
  {
    title: "Subjects",
    href: "/dashboard/subjects",
    icon: <BookOpen className="h-5 w-5" />,
    adminOnly: true,
  },
  {
    title: "Exam Schedule",
    href: "/dashboard/exams",
    icon: <Calendar className="h-5 w-5" />,
    adminOnly: true,
  },
  {
    title: "Attendance",
    href: "/dashboard/attendance",
    icon: <ClipboardList className="h-5 w-5" />,
  },
];

export function DashboardNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isAdmin = session?.user?.isAdmin;
  
  const filteredNavItems = navItems.filter(
    (item) => !item.adminOnly || (item.adminOnly && isAdmin)
  );

  return (
    <>
      <div className="hidden md:flex h-screen flex-col w-64 bg-card border-r border-border">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">ExamManager</span>
          </Link>
        </div>
        <div className="flex-1 px-4 space-y-1">
          {filteredNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                pathname === item.href
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-secondary"
              )}
            >
              {item.icon}
              {item.title}
            </Link>
          ))}
        </div>
        <div className="p-4 border-t border-border">
          <Button
            variant="outline"
            className="w-full justify-start gap-2"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </div>
      </div>

      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="md:hidden fixed top-4 left-4 z-40"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          <div className="flex flex-col h-full">
            <div className="p-6 border-b border-border">
              <Link href="/" className="flex items-center gap-2">
                <GraduationCap className="h-6 w-6 text-primary" />
                <span className="font-bold text-xl">ExamManager</span>
              </Link>
            </div>
            <div className="flex-1 px-4 py-4 space-y-1">
              {filteredNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                    pathname === item.href
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-secondary"
                  )}
                >
                  {item.icon}
                  {item.title}
                </Link>
              ))}
            </div>
            <div className="p-4 border-t border-border">
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}