import { TabsList, TabsTrigger } from '@/components/ui/tabs'
import React from 'react'

type IProps = {
  tabs: {
    label: string
    value: string
  }[]
  notificationCount: number
}

export default function TabSelector({ tabs, notificationCount }: IProps) {
  return (
    <div>
      <TabsList className="overflow-x-auto overflow-visible rounded-md">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="p-3 text-base font-medium"
          >
            <span className="relative inline-flex items-center">
              {tab.label}
              {tab.value === 'notifications' && notificationCount > 0 && (
                <span
                  className="absolute -top-2 -right-5 w-5 h-5 flex items-center justify-center rounded-full bg-black text-white text-xs font-bold shadow"
                  aria-label={`You have ${notificationCount} unread notifications`}
                  tabIndex={0}
                >
                  {notificationCount}
                </span>
              )}
            </span>
          </TabsTrigger>
        ))}
      </TabsList>
    </div>
  )
}
