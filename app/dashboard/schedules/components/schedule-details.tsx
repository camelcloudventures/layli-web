'use client'

import {
  Calendar,
  User,
  Building,
  FileText,
  Clock,
  CalendarDays,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { Schedule } from '@/lib/types/schedule-types'

interface ScheduleDetailsProps {
  schedule: Schedule
}

export function ScheduleDetails({ schedule }: ScheduleDetailsProps) {
  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case 'daily':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100'
      case 'weekly':
        return 'bg-green-100 text-green-800 hover:bg-green-100'
      case 'monthly':
        return 'bg-purple-100 text-purple-800 hover:bg-purple-100'
      case 'yearly':
        return 'bg-amber-100 text-amber-800 hover:bg-amber-100'
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100'
    }
  }

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Not set'
    try {
      return new Date(dateString).toLocaleDateString()
    } catch {
      return 'Invalid date'
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className="text-lg font-semibold">{schedule.title}</h3>
        <p className="text-sm text-muted-foreground">
          Created on {formatDate(schedule.createdAt)}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-medium">Frequency</p>
              <Badge
                className={getFrequencyColor(schedule.frequency)}
                variant="secondary"
              >
                {schedule.frequency.charAt(0).toUpperCase() +
                  schedule.frequency.slice(1)}
              </Badge>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-medium">Next Audit Date</p>
              <p className="text-muted-foreground">
                {formatDate(schedule.nextAuditDate)}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CalendarDays className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-medium">Created</p>
              <p className="text-muted-foreground">
                {formatDate(schedule.created_at)}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <User className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-medium">Assignee</p>
              <p className="text-muted-foreground">
                {schedule.assignee?.full_name || 'Not assigned'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Building className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-medium">Site</p>
              <p className="text-muted-foreground">
                {schedule.site?.name || 'No site'}
              </p>
              <p className="text-xs text-muted-foreground">
                {schedule.site?.address || ''}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-medium">Audit Template</p>
              <p className="text-muted-foreground">
                {schedule.template?.title || 'No template'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
