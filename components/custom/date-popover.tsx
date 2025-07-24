'use client '

import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from '@/components/ui/dialog'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { Label } from '../ui/label'
import { CalendarIcon } from 'lucide-react'
import { useState } from 'react'

type DatePopoverProps = {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
}

export default function DatePopover({ date, setDate }: DatePopoverProps) {
  const disabled = {
    before: new Date(),
  }
  const [open, setOpen] = useState(false)

  const handleDateSelect = (selectedDate: Date | undefined) => {
    console.log('Date selected:', selectedDate)
    setDate(selectedDate)
    setOpen(false)
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="due-date">
        Due Date <span className="text-red-500">*</span>
      </Label>
      <Dialog modal open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'w-full justify-start text-left font-normal',
              !date && 'text-muted-foreground',
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, 'PPP') : <span>Select date</span>}
          </Button>
        </DialogTrigger>
        <DialogContent className="w-auto p-4">
          <DialogTitle className="sr-only">Select Date</DialogTitle>
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            disabled={disabled}
            initialFocus
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
