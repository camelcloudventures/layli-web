'use client'

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Calendar,
  User,
  Building,
  FileText,
  MoreHorizontal,
} from 'lucide-react'
import type { Schedule } from '@/lib/types/schedule-types'

export function SchedulesList({ schedules }: { schedules: Schedule[] }) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredSchedules = useMemo(() => {
    if (!searchQuery.trim()) return schedules
    const query = searchQuery.toLowerCase().trim()
    return schedules.filter(
      (schedule) =>
        schedule.title.toLowerCase().includes(query) ||
        schedule.site?.name?.toLowerCase().includes(query) ||
        schedule.assignee?.name?.toLowerCase().includes(query) ||
        schedule.template?.title?.toLowerCase().includes(query) ||
        schedule.frequency.toLowerCase().includes(query),
    )
  }, [searchQuery, schedules])

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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Schedules</h1>
          <p className="text-muted-foreground">
            Manage audit schedules and timelines
          </p>
        </div>
        <Button className="h-10">+ Create Schedule</Button>
      </div>
      <Input
        placeholder="Search schedules by title, site, assignee, template or frequency..."
        className="mt-2"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <div className="space-y-4">
        {filteredSchedules.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No schedules found.
          </div>
        ) : (
          filteredSchedules.map((schedule) => (
            <div
              key={schedule.id}
              className="border rounded-md overflow-hidden bg-white"
            >
              <div className="p-6 space-y-4">
                <div className="flex justify-between">
                  <div>
                    <div className="font-semibold text-lg text-gray-900">
                      {schedule.title}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Next audit:{' '}
                      {schedule.nextAuditDate
                        ? new Date(schedule.nextAuditDate).toLocaleDateString()
                        : 'N/A'}
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" aria-label="More actions">
                    <MoreHorizontal className="h-5 w-5" />
                  </Button>
                </div>
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
              </div>
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
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
