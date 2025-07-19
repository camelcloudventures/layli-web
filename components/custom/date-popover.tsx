'use client '

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { Label } from '../ui/label'
import { CalendarIcon } from 'lucide-react'

type DatePopoverProps = {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
}

export default function DatePopover({ date, setDate }: DatePopoverProps) {
  const disabled = {
    before: new Date(),
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="due-date">
        Due Date <span className="text-red-500">*</span>
      </Label>
      <Popover>
        <PopoverTrigger asChild>
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
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            disabled={disabled}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
