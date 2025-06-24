'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  BarChart3,
  Calendar,
  CheckSquare,
  FileText,
  Home,
  Settings,
  AlertTriangle,
  Search,
} from 'lucide-react'
import type { NavItem } from '@/lib/config/dashboard-nav'

const iconMap = {
  home: Home,
  fileText: FileText,
  calendar: Calendar,
  alertTriangle: AlertTriangle,
  checkSquare: CheckSquare,
  search: Search,
  barChart3: BarChart3,
  settings: Settings,
} as const

interface SidebarNavProps {
  items: {
    top: NavItem[]
    middle: NavItem[]
    bottom: NavItem[]
  }
}

export function SidebarNav({ items }: SidebarNavProps) {
  const pathname = usePathname()

  const renderNavItems = (items: NavItem[]) => {
    return items.map((item) => {
      const Icon = iconMap[item.icon as keyof typeof iconMap]
      return (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
            pathname === item.href
              ? 'bg-accent text-accent-foreground'
              : 'transparent',
          )}
        >
          <Icon className="h-4 w-4" />
          <p className="ml-2">{item.title}</p>
        </Link>
      )
    })
  }

  return (
    <nav className="flex flex-col h-full py-6 w-56 justify-between ">
      <div className="space-y-1">{renderNavItems(items.top)}</div>
      <div className="flex-1 py-6">{renderNavItems(items.middle)}</div>
      <div className="space-y-1">{renderNavItems(items.bottom)}</div>
    </nav>
  )
}
