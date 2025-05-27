'use client'

import { Badge } from '@/components/ui/badge'
import { Calendar, User, Building } from 'lucide-react'
import type { Schedule } from '@/lib/types/schedule-types'

interface ScheduleInfoProps {
  schedule: Schedule
}

export function ScheduleInfo({ schedule }: ScheduleInfoProps) {
  function getFrequencyColor(frequency: string) {
    switch (frequency) {
      case 'daily':
        return 'bg-blue-100 text-blue-800'
      case 'weekly':
        return 'bg-green-100 text-green-800'
      case 'monthly':
        return 'bg-purple-100 text-purple-800'
      case 'yearly':
        return 'bg-amber-100 text-amber-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

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
        <Building className="h-4 w-4 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium">Site</p>
          <p className="text-sm text-muted-foreground">
            {schedule.site?.name || 'N/A'}
          </p>
        </div>
      </div>
    </div>
  )
}
