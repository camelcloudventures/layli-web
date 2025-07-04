'use client'

import { Label } from '@/components/ui/label'
import { User as UserIcon } from 'lucide-react'
import type { Question, Response } from '@/lib/types/inspection-types'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/lib/context/auth-provider'

interface PersonFieldProps {
  question: Question
  response?: Response
  onResponse: (value: string) => void
}

export function PersonField({ question }: PersonFieldProps) {
  const { user } = useAuth()

  return (
    <div className="space-y-2">
      <Label htmlFor={`question-${question.id}`}>
        {question.text}
        {question.required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <div className="flex items-center space-x-2">
        <UserIcon className="h-4 w-4 text-muted-foreground" />
        <Input
          name="response_value"
          type="text"
          value={user?.full_name || ''}
          disabled={true}
        />
      </div>
    </div>
  )
}
