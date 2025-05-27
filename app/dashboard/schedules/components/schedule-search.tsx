'use client'

import { Input } from '@/components/ui/input'

interface ScheduleSearchProps {
  value: string
  onChange: (value: string) => void
}

export function ScheduleSearch({ value, onChange }: ScheduleSearchProps) {
  return (
    <Input
      placeholder="Search schedules by title, site, assignee, template or frequency..."
      className="mt-2"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}
