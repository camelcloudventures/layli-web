'use client'

import { Badge } from '@/components/ui/badge'
import { Calendar, User } from 'lucide-react'
import type { Schedule } from '@/lib/types/schedule-types'
import { getFrequencyColor, getStatusColor } from '@/utils/utils'

interface ScheduleInfoProps {
  schedule: Schedule
}

export function ScheduleInfo({ schedule }: ScheduleInfoProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3 pt-2">
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium">Frequency</p>
          <Badge
            className={getFrequencyColor(schedule.frequency)}
            variant="secondary"
          >
            {schedule.frequency.charAt(0).toUpperCase() +
              schedule.frequency.slice(1)}
          </Badge>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <User className="h-4 w-4 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium">Assignee</p>
          <p className="text-sm text-muted-foreground">
            {schedule.assignee?.full_name || 'N/A'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <p className="text-sm font-medium">Status</p>
        <Badge
          className={getStatusColor(schedule.status || '')}
          variant="secondary"
        >
          {schedule.status ? schedule.status : 'Not started'}
        </Badge>
      </div>
    </div>
  )
}
