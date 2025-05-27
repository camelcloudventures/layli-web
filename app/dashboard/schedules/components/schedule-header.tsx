'use client'

import { Button } from '@/components/ui/button'

interface ScheduleHeaderProps {
  onCreateClick: () => void
}

export function ScheduleHeader({ onCreateClick }: ScheduleHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold">Schedules</h1>
        <p className="text-muted-foreground">
          Manage audit schedules and timelines
        </p>
      </div>
      <Button className="h-10" onClick={onCreateClick}>
        + Create Schedule
      </Button>
    </div>
  )
}
