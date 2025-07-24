'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Target, Building2 } from 'lucide-react'
import { type AnalyticsSummary } from '../actions/actions'

interface AnalyticsSummaryProps {
  data: AnalyticsSummary
}

export default function AnalyticsSummary({ data }: AnalyticsSummaryProps) {
  const passRate =
    data.total_inspections > 0
      ? ((data.passed_inspections / data.total_inspections) * 100).toFixed(1)
      : '0'

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Inspections
          </CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.total_inspections}</div>
          <p className="text-xs text-muted-foreground">All time inspections</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Sites</CardTitle>
          <Building2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.total_sites}</div>
          <p className="text-xs text-muted-foreground">Active sites</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Score</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {data.average_score.toFixed(1)}%
          </div>
          <p className="text-xs text-muted-foreground">
            Across all inspections
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
          <TrendingDown className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{passRate}%</div>
          <p className="text-xs text-muted-foreground">
            {data.passed_inspections} passed / {data.failed_inspections} failed
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
