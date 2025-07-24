'use client'

import { Notebook } from 'lucide-react'
import React from 'react'

interface NoteProps {
  note: string
  className?: string
}

export function NoteDisplay({ note, className = '' }: NoteProps) {
  if (!note) return null

  return (
    <div
      className={`flex items-center gap-3 p-3 border rounded-lg bg-muted/30 mt-2 ${className}`}
    >
      <div className="flex items-center gap-2">
        <Notebook className="h-4 w-4 text-muted-foreground" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium leading-relaxed">{note}</p>
        </div>
      </div>
    </div>
  )
}
