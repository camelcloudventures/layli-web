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
          <p className="text-sm font-medium">Assignees</p>
          <div className="text-sm text-muted-foreground flex flex-wrap gap-2">
            {schedule.assignees?.length > 0 ? (
              schedule.assignees.map((assignee, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="bg-blue-50  text-blue-700 border-blue-200 hover:bg-blue-100"
                >
                  {assignee.assignee.full_name}
                </Badge>
              ))
            ) : (
              <span className="text-sm text-muted-foreground">N/A</span>
            )}
          </div>
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
