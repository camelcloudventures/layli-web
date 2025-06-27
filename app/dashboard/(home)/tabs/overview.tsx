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
  const complianceScore = stats.find(
    (stat) => stat.title === 'Compliance Score',
  )?.value
  const issuesIdentified = stats.find((stat) => stat.title === 'Issues')?.value
  const auditProgress = stats.find((stat) => stat.title === 'Audit Progress')
    ?.value

  const issuesResolved = stats.find((stat) => stat.title === 'Issues resolved')
    ?.value

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
              <Badge variant="outline" className="bg-green-50 text-green-700">
                Good
              </Badge>
            </div>
            <Progress value={complianceScore} className="h-2" />
            <p className="text-xs text-muted-foreground">
              Based on completed audits and resolved issues
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
                  {issuesIdentified}
                </div>
                <p className="text-xs text-muted-foreground">Resolved</p>
              </div>
            </div>
            <Progress
              value={(issuesIdentified! / issuesResolved!) * 100}
              className="h-2"
            />
            <p className="text-xs text-muted-foreground">
              {((issuesResolved! / issuesIdentified!) * 100).toFixed(0)}%
              resolution rate
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Audit Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">{auditProgress}%</span>
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                In Progress
              </Badge>
            </div>
            <Progress value={auditProgress} className="h-2" />
            <p className="text-xs text-muted-foreground">
              Overall completion of active audits
            </p>
          </CardContent>
        </Card>
      </div>
    </TabsContent>
  )
}
