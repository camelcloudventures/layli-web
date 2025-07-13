'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Inspection } from '@/lib/types/inspection-types'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

type EmptyStateProps = {
  currentInspection: Inspection
}
export function EmptyState({ currentInspection }: EmptyStateProps) {
  const router = useRouter()
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => router.push('/dashboard/inspections')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Inspections
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{currentInspection.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No pages found in this inspection.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
