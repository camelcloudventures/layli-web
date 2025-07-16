'use client'

import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Check, X } from 'lucide-react'
import type { Question, Response } from '@/lib/types/inspection-types'
import { cn } from '@/lib/utils'

interface BooleanFieldProps {
  question: Question
  response?: Response
  onResponse: (value: string) => void
  isDisabled?: boolean
}

export function BooleanField({
  question,
  response,
  onResponse,
  isDisabled,
}: BooleanFieldProps) {
  const selectedValue = response?.response_value || ''

  return (
    <div className="space-y-2">
      <Label>{question.text}</Label>
      <div className="flex w-44 gap-2">
        <Button
          type="button"
          variant="outline"
          className={cn(
            'flex-1 hover:bg-[#D3EFDD] hover:text-[#399D57] ',
            selectedValue === 'true' &&
              'bg-[#D3EFDD] text-[#399D57]  font-bold',
          )}
          onClick={() => onResponse('true')}
          disabled={isDisabled}
        >
          <Check className="h-4 w-4 " />
          Yes
        </Button>
        <Button
          type="button"
          variant="outline"
          className={cn(
            'flex-1 hover:bg-[#EFD2D3] hover:text-[#B55A61] ',
            selectedValue === 'false' &&
              'bg-[#EFD2D3] text-[#B55A61] font-bold',
          )}
          onClick={() => onResponse('false')}
          disabled={isDisabled}
        >
          <X className="h-4 w-4 " />
          No
        </Button>
      </div>
    </div>
  )
}
