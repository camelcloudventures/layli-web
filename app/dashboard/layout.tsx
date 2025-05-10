import type React from 'react'
import type { Metadata } from 'next'
import { dashboardNavItems } from '@/lib/config/dashboard-nav'
import { SidebarNav } from '@/components/layout/sidebar-nav'
import { DashboardHeader } from '@/components/layout/dashboard-header'

export const metadata: Metadata = {
  title: 'Dashboard - Audit Management System',
  description: 'Dashboard for the Audit Management System',
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <DashboardHeader />
      <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr] lg:grid-cols-[240px_1fr]">
        <aside className="hidden border-r md:block">
          <div className="sticky top-16 -ml-2 h-[calc(100vh-4rem)]">
            <SidebarNav items={dashboardNavItems} />
          </div>
        </aside>
        <main className="flex w-full flex-col overflow-hidden py-6">
          {children}
        </main>
      </div>
    </>
  )
}
