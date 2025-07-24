'use client'

import React from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs'
import { cn } from '@/lib/utils'

interface TabItem {
  value: string
  label: string
  content: React.ReactNode
}

interface TabsSwitcherProps {
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  tabs: TabItem[]
  className?: string
}

export default function TabsSwitcher({
  defaultValue,
  value,
  onValueChange,
  tabs,
  className = 'grid w-full grid-cols-2',
}: TabsSwitcherProps) {
  return (
    <Tabs
      defaultValue={defaultValue}
      value={value}
      onValueChange={onValueChange}
    >
      <TabsList className={cn(className, 'grid w-full grid-cols-2  ')}>
        {tabs.map((tab) => (
          <TabsTrigger
            className="flex w-full cursor-pointer  flex-1 justify-center items-center"
            key={tab.value}
            value={tab.value}
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map((tab) => (
        <TabsContent
          key={tab.value}
          value={tab.value}
          className="space-y-4 pt-4"
        >
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  )
}
