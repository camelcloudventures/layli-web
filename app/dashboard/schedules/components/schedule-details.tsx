'use client'

import { useState } from 'react'

import {
  Calendar,
  CalendarDays,
  Clock,
  FileText,
  User,
  Building,
  Play,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Schedule } from '@/lib/types/schedule-types'
import { getFrequencyColor, getStatusColor } from '@/utils/utils'

interface ScheduleDetailsProps {
  schedule: Schedule
  onStatusUpdate?: (status: string) => Promise<void>
}

export function ScheduleDetails({
  schedule,
  onStatusUpdate,
}: ScheduleDetailsProps) {
  const [loading, setLoading] = useState(false)

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Not set'
    try {
      return new Date(dateString).toLocaleDateString()
    } catch {
      return 'Invalid date'
    }
  }

  return (
    <div className="space-y-5">
      {/* Header Section */}
      <div className="space-y-1">
        <h3 className="text-lg font-semibold">{schedule.title}</h3>
        <p className="text-sm text-muted-foreground">
          Created on {formatDate(schedule.created_at)}
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-4 md:grid-cols-2 bg-muted/50 border border-muted/80 p-4 rounded-lg">
        {/* Left Column */}
        <div className="space-y-3 flex flex-col gap-2 items-start justify-center">
          <div className="flex items-center gap-3 p-3 rounded-lg ">
            <div className="p-1.5 rounded-md bg-background">
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-muted-foreground">
                Frequency
              </p>
              <Badge
                className={`${getFrequencyColor(schedule.frequency)} mt-1`}
                variant="secondary"
              >
                {schedule.frequency.charAt(0).toUpperCase() +
                  schedule.frequency.slice(1)}
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg ">
            <div className="p-1.5 rounded-md bg-background">
              <Clock className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-muted-foreground">
                Next Due Date
              </p>
              <p className="text-sm font-medium text-foreground mt-0.5 truncate">
                {formatDate(schedule.next_date)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg ">
            <div className="p-1.5 rounded-md bg-background">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-muted-foreground">
                Created On
              </p>
              <p className="text-sm font-medium text-foreground mt-0.5 truncate">
                {formatDate(schedule.created_at)}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 rounded-lg ">
            <div className="p-1.5 rounded-md bg-background">
              <User className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-muted-foreground">
                Assignee
              </p>
              <p className="text-sm font-medium text-foreground mt-0.5 truncate">
                {schedule.assignee?.full_name || 'Not assigned'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg ">
            <div className="p-1.5 rounded-md bg-background">
              <Building className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-muted-foreground">Site</p>
              <p className="text-sm font-medium text-foreground mt-0.5 truncate">
                {schedule.site?.name || 'No site'}
              </p>
              {schedule.site?.address && (
                <p className="text-xs text-muted-foreground mt-0.5 truncate">
                  {schedule.site.address}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg ">
            <div className="p-1.5 rounded-md bg-background">
              <FileText className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-muted-foreground">
                Audit Template
              </p>
              <p className="text-sm font-medium text-foreground mt-0.5 truncate">
                {schedule.template?.title || 'No template'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Status Section */}
      <div className="border-t pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <p className="text-sm font-medium text-muted-foreground">Status</p>
            <Badge
              className={getStatusColor(schedule.status || '')}
              variant="secondary"
            >
              {schedule.status
                ? schedule.status.charAt(0).toUpperCase() +
                  schedule.status.slice(1)
                : 'Not started'}
            </Badge>
          </div>

          {onStatusUpdate && (
            <div className="flex gap-2">
              {schedule.status === 'active' && (
                <Button
                  variant="outline"
                  size="sm"
                  disabled={loading}
                  onClick={async () => {
                    setLoading(true)
                    await onStatusUpdate('paused')
                    setLoading(false)
                  }}
                  className="h-8 px-3"
                  aria-label="Pause Schedule"
                >
                  {loading ? (
                    <>
                      <div className="w-3 h-3 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Pausing...
                    </>
                  ) : (
                    <>
                      <div className="w-3 h-3 mr-2 flex">
                        <div className="w-1 h-3 bg-current mr-0.5"></div>
                        <div className="w-1 h-3 bg-current"></div>
                      </div>
                      Pause
                    </>
                  )}
                </Button>
              )}
              {schedule.status === 'paused' && (
                <Button
                  variant="outline"
                  size="sm"
                  disabled={loading}
                  onClick={async () => {
                    setLoading(true)
                    await onStatusUpdate('active')
                    setLoading(false)
                  }}
                  className="h-8 px-3"
                  aria-label="Resume Schedule"
                >
                  {loading ? (
                    <>
                      <div className="w-3 h-3 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Resuming...
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-3 w-3" />
                      Resume
                    </>
                  )}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
