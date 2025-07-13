'use client'

import React from 'react'

interface NoteProps {
  note: string
  className?: string
}

export function NoteDisplay({ note, className = '' }: NoteProps) {
  if (!note) return null

  return (
    <div
      className={`mt-2 p-3 bg-gray-50 rounded-md shadow-sm border ${className}`}
    >
      <div className="flex items-start space-x-2">
        <svg
          className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-700 leading-relaxed">{note}</p>
        </div>
      </div>
    </div>
  )
}
