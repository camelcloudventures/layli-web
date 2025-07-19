'use client'

import { Button } from '@/components/ui/button'

interface PageHeaderProps {
  title: string
  description: string
  actions: {
    label: string
    variant?: 'default' | 'outline' | 'ghost' | 'link'
    icon?: React.ReactNode
    onClick: () => void
  }[]
}

export default function PageHeader({
  title,
  description,
  actions,
}: PageHeaderProps) {
  return (
    <div className="flex w-full items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <div className="flex items-center gap-2">
        {actions.map((action) => (
          <Button
            key={action.label}
            onClick={action.onClick}
            variant={action.variant}
          >
            {action.icon}
            {action.label}
          </Button>
        ))}
      </div>
    </div>
  )
}
