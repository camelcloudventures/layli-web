'use client'

import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import type { Question, Response } from '@/lib/types/inspection-types'
import { useState, useEffect } from 'react'

interface DateFieldProps {
  question: Question
  response?: Response
  onResponse: (value: string) => void
  isDisabled?: boolean
}

export function DateField({
  question,
  response,
  onResponse,
  isDisabled,
}: DateFieldProps) {
  const [date, setDate] = useState<Date | undefined>(
    response?.response_value ? new Date(response.response_value) : undefined,
  )

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate)
    if (selectedDate) {
      onResponse(selectedDate.toISOString())
    }
  }

  useEffect(() => {
    setDate(
      response?.response_value ? new Date(response.response_value) : undefined,
    )
  }, [response?.response_value])

  return (
    <div className="space-y-2">
      <Label htmlFor={question.id.toString()}>{question.text}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={'outline'}
            className={cn(
              'w-full justify-start text-left font-normal',
              !date && 'text-muted-foreground',
            )}
            disabled={isDisabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, 'PPP') : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            initialFocus
            disabled={isDisabled}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
