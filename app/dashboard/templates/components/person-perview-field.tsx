import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectValue } from '@/components/ui/select'
import { SelectItem } from '@/components/ui/select'
import { SelectTrigger } from '@/components/ui/select'
import React from 'react'
import { Question } from '@/lib/types/audit-types'

export default function PersonPerviewField({
  question,
}: {
  question: Question
}) {
  return (
    <div>
      {question.field_type === 'PERSON' && (
        <div className="space-y-2">
          <Label htmlFor={`person-${question.id}`}>Person</Label>
          <Select defaultValue={question.response_options?.[0]?.id.toString()}>
            <SelectTrigger>
              <SelectValue placeholder="Select a person" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">John Doe</SelectItem>
              <SelectItem value="2">Jane Smith</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  )
}
