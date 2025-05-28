'use client'

import type { Schedule } from '@/lib/types/schedule-types'
import { ScheduleActions } from './schedule-actions'
import { ScheduleInfo } from './schedule-info'
import { ScheduleFooter } from './schedule-footer'
import HasPermission from '../../components/has-permission'
import { Permission } from '@/lib/auth/auth'

interface ScheduleCardProps {
  schedule: Schedule
  onEdit: (schedule: Schedule) => void
  onDelete: (schedule: Schedule) => void
  onViewDetails: (schedule: Schedule) => void
}

export function ScheduleCard({
  schedule,
  onEdit,
  onDelete,
  onViewDetails,
}: ScheduleCardProps) {
  return (
    <div className="border rounded-md overflow-hidden bg-white">
      <div className="p-6 space-y-4">
        <div className="flex justify-between">
          <div>
            <div className="font-semibold text-lg text-gray-900">
              {schedule.title}
            </div>
            <div className="text-sm text-muted-foreground">
              Next due date:{' '}
              {schedule.next_date
                ? new Date(schedule.next_date).toLocaleDateString()
                : 'N/A'}
            </div>
          </div>
          <HasPermission permission={Permission.MANAGE_SCHEDULES}>
            <ScheduleActions
              schedule={schedule}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </HasPermission>
        </div>
        <ScheduleInfo schedule={schedule} />
      </div>
      <ScheduleFooter schedule={schedule} onViewDetails={onViewDetails} />
    </div>
  )
}
