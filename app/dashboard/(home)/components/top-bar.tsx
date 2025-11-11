"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ListChecks,
  BarChart3,
  Plus,
  Calendar,
  Flag,
  Users,
  CheckCircle2,
  Search,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { FileText } from "lucide-react";
import React from "react";

const createOptions = {
  admin: [
    {
      label: "Create Audit Template",
      icon: FileText,
      href: "/dashboard/templates",
    },
    { label: "Create Schedule", icon: Calendar, href: "/dashboard/schedules" },
    { label: "Create Action", icon: ListChecks, href: "/dashboard/actions" },
    { label: "Create User", icon: Users, href: "/dashboard/settings?tab=advanced" },
  ],
  auditor: [
    {
      label: "Create Audit Template",
      icon: FileText,
      href: "/dashboard/templates",
    },
    { label: "Create Schedule", icon: Calendar, href: "/dashboard/schedules" },
    { label: "Create Action", icon: ListChecks, href: "/dashboard/actions" },
    { label: "Report Issue", icon: Flag, href: "/dashboard/issues" },
  ],
  supervisor: [
    {
      label: "Create Audit Template",
      icon: FileText,
      href: "/dashboard/templates",
    },
    { label: "Create Schedule", icon: Calendar, href: "/dashboard/schedules" },
    { label: "Create Action", icon: ListChecks, href: "/dashboard/actions" },
    { label: "Generate Report", icon: BarChart3, href: "/dashboard/analytics" },
  ],
};

// Role-based quick actions
const quickActions = {
  admin: [
    { label: "Create New Audit", icon: Plus, href: "/dashboard/templates" },
    {
      label: "Manage Users",
      icon: Users,
      href: "/dashboard/settings?tab=advanced",
    },
    { label: "System Settings", icon: Settings, href: "/dashboard/settings" },
  ],
  auditor: [
    { label: "Start New Audit", icon: Plus, href: "/dashboard/templates" },
    { label: "Review Findings", icon: Search, href: "/dashboard/issues" },
    { label: "Submit Report", icon: FileText, href: "/dashboard/actions" },
  ],
  supervisor: [
    { label: "Approve Audits", icon: CheckCircle2, href: "/dashboard/audits" },
    { label: "Assign Tasks", icon: Users, href: "/dashboard/actions" },
    { label: "View Reports", icon: BarChart3, href: "/dashboard/analytics" },
  ],
};
interface User {
  fullName: string;
  email: string;
  role: "admin" | "auditor" | "supervisor";
  image?: string;
}

export default function TopBar({ user }: { user: User }) {
  // Role-based quick actions
  const userActions =
    quickActions[user.role as keyof typeof quickActions] ||
    quickActions.auditor;

  // Get create options based on user role
  const userCreateOptions =
    createOptions[user.role as keyof typeof createOptions] ||
    createOptions.auditor;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

        {/* Create Button with Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Create
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {userCreateOptions.map((option, index) => (
              <DropdownMenuItem key={index} asChild>
                <Link
                  href={option.href}
                  className="flex items-center cursor-pointer"
                >
                  <option.icon className="text-primary" />
                  <span>{option.label}</span>
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {userActions.map((action, index) => (
          <Link href={action.href} key={index}>
            <div className="rounded-lg border text-card-foreground hover:bg-accent/50 transition-colors cursor-pointer">
              <div className="flex items-center gap-4 p-4">
                <div className="rounded-full bg-primary/10 p-2">
                  <action.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{action.label}</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
