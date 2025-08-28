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
        {/* Aside (fixed width, positioned under header) */}
        <aside className="hidden md:block w-60 bg-[#FBFCFD] border-r">
          <div className="h-full">
            <SidebarNav items={dashboardNavItems} />
          </div>
        </aside>

        {/* Main content (fills the rest, positioned under header) */}
        <main className="flex-1  overflow-y-auto py-6 px-4">{children}</main>
      </div>
    </div>
  );
}
