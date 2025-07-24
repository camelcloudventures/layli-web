'use client'
import { TabsContent } from '@/components/ui/tabs'
import { StatCard } from '../components/stat-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  FileText,
  Users,
  Clock,
  CheckCircle2,
  Flag,
  Layers,
} from 'lucide-react'

type IProps = {
  stats: {
    id: number
    title: string
    value: number
    description: string
    icon: string
  }[]
}

const iconMap = {
  FileText,
  Users,
  Clock,
  CheckCircle2,
  Flag,
  Layers,
}

export default function Overview({ stats }: IProps) {
  // Find stats with proper fallbacks
  const totalInspections =
    stats.find((stat) => stat.title === 'Total Inspections')?.value || 0
  const completedInspections =
    stats.find((stat) => stat.title === 'Completed Inspections')?.value || 0
  const averageScore =
    stats.find((stat) => stat.title === 'Average Score')?.value || 0
  const failedInspections =
    stats.find((stat) => stat.title === 'Failed Inspections')?.value || 0

  // Calculate derived metrics
  const complianceScore = averageScore // Use average score as compliance score
  const issuesIdentified = failedInspections
  const issuesResolved = completedInspections
  const auditProgress =
    totalInspections > 0
      ? Math.round((completedInspections / totalInspections) * 100)
      : 0

  // Check if we have real data
  const hasRealData = totalInspections > 0

  return (
    <TabsContent value="overview" className="space-y-6">
      {/* Key metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.slice(0, 4).map((stat) => {
          const Icon = iconMap[stat.icon as keyof typeof iconMap]
          return (
            <StatCard
              key={stat.id}
              title={stat.title}
              value={stat.value}
              description={stat.description}
              icon={Icon}
            />
          )
        })}
      </div>

      {/* Additional metrics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Compliance Score
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">{complianceScore}%</span>
              <Badge
                variant="outline"
                className={
                  complianceScore >= 80
                    ? 'bg-green-50 text-green-700'
                    : complianceScore >= 60
                    ? 'bg-yellow-50 text-yellow-700'
                    : 'bg-red-50 text-red-700'
                }
              >
                {complianceScore >= 80
                  ? 'Good'
                  : complianceScore >= 60
                  ? 'Fair'
                  : 'Poor'}
              </Badge>
            </div>
            <Progress value={complianceScore} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {hasRealData
                ? 'Based on completed inspections and resolved issues'
                : 'No data available yet'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Issues</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{issuesIdentified}</div>
                <p className="text-xs text-muted-foreground">
                  Total identified
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">
                  {issuesResolved}
                </div>
                <p className="text-xs text-muted-foreground">Resolved</p>
              </div>
            </div>
            <Progress
              value={
                issuesIdentified > 0
                  ? (issuesResolved / issuesIdentified) * 100
                  : 0
              }
              className="h-2"
            />
            <p className="text-xs text-muted-foreground">
              {hasRealData && issuesIdentified > 0
                ? `${((issuesResolved / issuesIdentified) * 100).toFixed(
                    0,
                  )}% resolution rate`
                : 'No issues data available'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Inspection Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">{auditProgress}%</span>
              <Badge
                variant="outline"
                className={
                  auditProgress >= 80
                    ? 'bg-green-50 text-green-700'
                    : auditProgress >= 50
                    ? 'bg-blue-50 text-blue-700'
                    : 'bg-yellow-50 text-yellow-700'
                }
              >
                {auditProgress >= 80
                  ? 'Complete'
                  : auditProgress >= 50
                  ? 'In Progress'
                  : 'Starting'}
              </Badge>
            </div>
            <Progress value={auditProgress} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {hasRealData
                ? 'Overall completion of inspections'
                : 'No inspections data available'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Data availability notice */}
      {!hasRealData && (
        <Card className="border-dashed">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                No inspection data available yet. Start conducting inspections
                to see insights here.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </TabsContent>
  )
}
