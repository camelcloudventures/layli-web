'use client'

import Link from 'next/link'
import { UserAccountNav } from '@/components/layout/user-account-nav'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { SidebarNav } from '@/components/layout/sidebar-nav'
import { dashboardNavItems } from '@/lib/config/dashboard-nav'
import { useEffect, useState } from 'react'
import { useMobile } from '@/hooks/use-mobile'
import { useAuth } from '@/lib/context/auth-provider'

export function DashboardHeader() {
  const { activeOrg } = useAuth()
  const [open, setOpen] = useState(false)
  const isMobile = useMobile()

  console.log('activeOrg', activeOrg)

  // Close mobile nav when screen size changes
  useEffect(() => {
    if (!isMobile) {
      setOpen(false)
    }
  }, [isMobile])

  return (
    <header className="sticky top-0 mx-10 border-b bg-background">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          {isMobile && (
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[240px] sm:w-[280px]">
                <nav className="flex flex-col gap-4">
                  <Link href="/dashboard" className="flex items-center gap-2">
                    <h1 className="text-xl font-bold">Audit Management</h1>
                  </Link>
                  <SidebarNav items={dashboardNavItems} />
                </nav>
              </SheetContent>
            </Sheet>
          )}
          <Link href="/dashboard" className="flex items-center gap-2">
            <h1 className="text-xl font-bold">{activeOrg?.name}</h1>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <UserAccountNav />
        </div>
      </div>
    </header>
  )
}
