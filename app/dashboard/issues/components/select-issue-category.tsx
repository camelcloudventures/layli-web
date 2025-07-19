'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { IssueCategory } from '@/lib/types/issue-types'
import { cn } from '@/lib/utils'
import {
  CheckCircle2,
  Cog,
  FileText,
  HelpCircle,
  Leaf,
  Siren,
} from 'lucide-react'
import type React from 'react'

interface SelectIssueCategoryProps {
  category: IssueCategory
  setCategory: (category: IssueCategory) => void
}

interface CategoryOption {
  id: IssueCategory
  icon: React.ComponentType<{ className?: string }>
  label: string
  description: string
}

const categoryOptions: CategoryOption[] = [
  {
    id: 'safety',
    icon: Siren,
    label: 'Safety',
    description: 'Issues related to workplace safety',
  },
  {
    id: 'compliance',
    icon: FileText,
    label: 'Compliance',
    description: 'Regulatory or compliance issues',
  },
  {
    id: 'operational',
    icon: Cog,
    label: 'Operational',
    description: 'Day-to-day operations issues',
  },
  {
    id: 'environmental',
    icon: Leaf,
    label: 'Environmental',
    description: 'Environmental impact concerns',
  },
  {
    id: 'quality',
    icon: CheckCircle2,
    label: 'Quality',
    description: 'Product or service quality issues',
  },
  {
    id: 'other',
    icon: HelpCircle,
    label: 'Other',
    description: 'Other types of issues',
  },
]

export default function SelectIssueCategory({
  category,
  setCategory,
}: SelectIssueCategoryProps) {
  const getCategoryButtonStyles = (isSelected: boolean) => {
    return cn(
      'flex flex-col h-auto py-4 px-3 transition-all duration-200',
      isSelected
        ? 'bg-red-100 text-red-800 border-red-300 hover:bg-red-150'
        : 'bg-white border-gray-200 text-gray-900 hover:bg-red-50 hover:border-red-200 hover:text-red-900',
    )
  }

  const getIconStyles = (isSelected: boolean) => {
    return cn(
      'h-6 w-6 mb-2 transition-colors duration-200',
      isSelected ? 'text-red-700' : 'text-gray-600',
    )
  }

  const getDescriptionStyles = (isSelected: boolean) => {
    return cn(
      'text-xs mt-1 transition-colors duration-200',
      isSelected
        ? 'text-red-600'
        : 'text-muted-foreground group-hover:text-red-700',
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium mb-4">
          Select Issue Category <span className="text-red-500">*</span>
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {categoryOptions.map((option) => {
            const isSelected = category === option.id
            const IconComponent = option.icon

            return (
              <Button
                key={option.id}
                type="button"
                variant="outline"
                className={getCategoryButtonStyles(isSelected)}
                onClick={() => setCategory(option.id)}
              >
                <IconComponent className={getIconStyles(isSelected)} />
                <span
                  className={cn('font-medium', isSelected && 'text-red-800')}
                >
                  {option.label}
                </span>
                <span className={getDescriptionStyles(isSelected)}>
                  {option.description}
                </span>
              </Button>
            )
          })}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="title">
          Issue Title <span className="text-red-500">*</span>
        </Label>
        <Input
          id="title"
          name="title"
          placeholder="Enter a clear and concise title"
          className="focus:border-red-500 focus:ring-red-500"
        />
      </div>
    </div>
  )
}
