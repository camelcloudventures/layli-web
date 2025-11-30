"use client";

import Link from "next/link";
import { UserAccountNav } from "@/components/layout/user-account-nav";
import { Menu, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { dashboardNavItems } from "@/lib/config/dashboard-nav";
import { useEffect, useState } from "react";
import { useMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/lib/context/auth-provider";
import Image from "next/image";
import { NotificationPanel } from "@/components/layout/notification-panel";
import { useNotifications } from "@/hooks/use-notifications";

export function DashboardHeader() {
  const { activeOrg } = useAuth();
  const [open, setOpen] = useState(false);
  const [notificationPanelOpen, setNotificationPanelOpen] = useState(false);
  const isMobile = useMobile();
  const { notifications } = useNotifications();

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  // Close mobile nav when screen size changes
  useEffect(() => {
    if (!isMobile) {
      setOpen(false);
    }
  }, [isMobile]);

  return (
    <header className="sticky top-0 border-b bg-[#FBFCFD] z-50 w-full">
      <div className="flex w-full justify-between items-center py-6 px-4">
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
            {activeOrg?.logo ? (
              <Image
                src={activeOrg.logo}
                alt={activeOrg?.name || "Organization"}
                width={40}
                height={40}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-bold text-sm">
                  {activeOrg?.name
                    ? activeOrg.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)
                    : "ORG"}
                </span>
              </div>
            )}
            <h1 className="text-xl font-bold">{activeOrg?.name}</h1>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="relative h-8 w-8"
            onClick={() => setNotificationPanelOpen(true)}
            aria-label={`Notifications${
              unreadCount > 0 ? ` (${unreadCount} unread)` : ""
            }`}
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold ring-2 ring-white">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </Button>
          <UserAccountNav />
        </div>
      </div>
      <NotificationPanel
        open={notificationPanelOpen}
        onOpenChange={setNotificationPanelOpen}
      />
    </header>
  );
}
