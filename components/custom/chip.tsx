'use client'

import { cn } from '@/lib/utils'
import React from 'react'
import { Badge } from '../ui/badge'
import { Category, Priority, Status } from '@/lib/types'

type ChipProps = {
  type: 'category' | 'status' | 'priority'
  value: Status | Category | Priority
}

function getChipType() {
  return {
    category: categoryMap,
    status: statusMap,
    priority: priorityMap,
  }
}

const statusMap = {
  [Status.IN_PROGRESS]: {
    label: 'In Progress',
    color: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
  },
  [Status.RESOLVED]: {
    label: 'Resolved',
    color: 'bg-green-100 text-green-800 hover:bg-green-100',
  },
  [Status.OPEN]: {
    label: 'Open',
    color: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
  },
  [Status.CLOSED]: {
    label: 'Closed',
    color: 'bg-gray-100 text-gray-800 hover:bg-gray-100',
  },
}

const categoryMap = {
  [Category.safety]: {
    label: 'Safety',
    color: 'bg-red-100 text-red-800 hover:bg-red-100',
  },
  [Category.quality]: {
    label: 'Quality',
    color: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
  },
  [Category.productivity]: {
    label: 'Productivity',
    color: 'bg-green-100 text-green-800 hover:bg-green-100',
  },
  [Category.environment]: {
    label: 'Environment',
    color: 'bg-gray-100 text-gray-800 hover:bg-gray-100',
  },
}

const priorityMap = {
  [Priority.high]: {
    label: 'High',
    color: 'bg-red-100 text-red-800 hover:bg-red-100',
  },
  [Priority.medium]: {
    label: 'Medium',
    color: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
  },
  [Priority.low]: {
    label: 'Low',
    color: 'bg-gray-100 text-gray-800 hover:bg-gray-100',
  },
}

export default function Chip({ type, value }: ChipProps) {
  const chipType = getChipType()
  const typeMap = chipType[type]
  const chipData = typeMap[value as keyof typeof typeMap] as
    | { label: string; color: string }
    | undefined

  if (!chipData?.label || !chipData?.color) {
    console.warn(`No chip data found for type: ${type}, value: ${value}`)
    return null
  }

  return (
    <Badge
      className={cn('rounded-full font-medium ', chipData.color)}
      variant="outline"
    >
      {chipData.label}
    </Badge>
  )
}
