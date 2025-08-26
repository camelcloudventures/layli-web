import type React from "react";
import type { Metadata } from "next";
import { dashboardNavItems } from "@/lib/config/dashboard-nav";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { DashboardHeader } from "@/components/layout/dashboard-header";

export const metadata: Metadata = {
  title: "Dashboard - Audit Management System",
  description: "Dashboard for the Audit Management System",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex flex-col">
      <DashboardHeader />

      <div className="flex flex-1">
        {/* Aside (fixed width, white background) */}
        <aside className="hidden md:block w-60 bg-white border-r">
          <div className="sticky top-16 h-[calc(100vh-4rem)]">
            <SidebarNav items={dashboardNavItems} />
          </div>
        </aside>

        {/* Main content (fills the rest, blue background) */}
        <main className="flex-1 bg-primary/5 overflow-y-auto py-6 px-4">
          {children}
        </main>
      </div>

      {/* <div className="flex flex-1 gap-12 md:grid-cols-[200px_1fr] lg:grid-cols-[240px_1fr] mx-12 bg-primary/5 px-2">
        <aside className="hidden border-r md:block bg-white">
          <div className="sticky top-16 -ml-2 h-[calc(100vh-4rem)]">
            <SidebarNav items={dashboardNavItems} />
          </div>
        </aside>
        <main className="flex w-full flex-col overflow-hidden py-6">
          {children}
        </main>
      </div> */}
    </div>
  );
}
