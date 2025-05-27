'use client'

import { FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Schedule } from '@/lib/types/schedule-types'

interface ScheduleFooterProps {
  schedule: Schedule
  onViewDetails: (schedule: Schedule) => void
}

export function ScheduleFooter({
  schedule,
  onViewDetails,
}: ScheduleFooterProps) {
  function getPriorityColor(priority: string) {
    switch (priority) {
      case 'high':
        return 'text-red-600'
      case 'medium':
        return 'text-yellow-600'
      case 'low':
        return 'text-green-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <div className="border-t bg-muted/50 p-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <FileText className="h-4 w-4 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Template: {schedule.template?.title || 'N/A'}
        </p>
        <span
          className={`ml-4 font-semibold ${getPriorityColor(
            schedule.priority,
          )}`}
        >
          Priority: {schedule.priority}
        </span>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onViewDetails(schedule)}
      >
        View Details
      </Button>
    </div>
  )
}
