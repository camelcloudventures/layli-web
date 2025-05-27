import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ScheduleDetails } from './schedule-details'
import type { Schedule } from '@/lib/types/schedule-types'
import { Button } from '@/components/ui/button'

export function ScheduleDetailsDialog({
  open,
  onOpenChange,
  schedule,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  schedule: Schedule | null
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Schedule Details</DialogTitle>
        </DialogHeader>
        {schedule && <ScheduleDetails schedule={schedule} />}
        <div className="flex justify-end mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
