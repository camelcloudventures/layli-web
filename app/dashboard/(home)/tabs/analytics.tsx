'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Cell } from 'recharts'
import { PieChart, Pie } from 'recharts'
import { LineChart, Line } from 'recharts'
import { ResponsiveContainer } from 'recharts'
import Link from 'next/link'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

// Fallback data for when real data is not available
const fallbackInspectionTrends = [
  { month: 'Jan', completed: 0, passed: 0, failed: 0 },
  { month: 'Feb', completed: 0, passed: 0, failed: 0 },
  { month: 'Mar', completed: 0, passed: 0, failed: 0 },
  { month: 'Apr', completed: 0, passed: 0, failed: 0 },
  { month: 'May', completed: 0, passed: 0, failed: 0 },
  { month: 'Jun', completed: 0, passed: 0, failed: 0 },
]

const fallbackIssuesByCategory = [{ name: 'No Data', value: 1 }]

const fallbackActionCompletionRate = [
  { month: 'Jan', rate: 0 },
  { month: 'Feb', rate: 0 },
  { month: 'Mar', rate: 0 },
  { month: 'Apr', rate: 0 },
  { month: 'May', rate: 0 },
  { month: 'Jun', rate: 0 },
]

type IProps = {
  inspectionTrends?: {
    month: string
    completed: number
    passed: number
    failed: number
  }[]
  issuesByCategory?: {
    name: string
    value: number
  }[]
  actionCompletionRate?: {
    month: string
    rate: number
  }[]
  summary?: {
    total_inspections: number
    total_sites: number
    average_score: number
    failed_inspections: number
    passed_inspections: number
  } | null
}

export default function Analytics({
  inspectionTrends = fallbackInspectionTrends,
  issuesByCategory = fallbackIssuesByCategory,
  actionCompletionRate = fallbackActionCompletionRate,
  summary,
}: IProps) {
  // Use backend data if available, otherwise use fallback data
  const totalInspections = summary?.total_inspections || 0
  const averageScore = summary?.average_score || 0
  const openIssues = summary?.failed_inspections || 0
  const actionCompletion =
    summary?.passed_inspections && summary?.total_inspections
      ? Math.round(
          (summary.passed_inspections / summary.total_inspections) * 100,
        )
      : 0

  // Check if we have real data
  const hasRealData = summary && summary.total_inspections > 0
  const hasIssuesData =
    issuesByCategory &&
    issuesByCategory.length > 0 &&
    issuesByCategory[0].name !== 'No Data'
  const hasTrendsData =
    inspectionTrends && inspectionTrends.some((trend) => trend.completed > 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Analytics</CardTitle>
        <CardDescription>
          {hasRealData
            ? 'View detailed analytics about your audit activities'
            : 'No analytics data available yet. Start conducting inspections to see insights here.'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="flex flex-col items-center justify-center rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
            <span className="text-sm font-medium text-muted-foreground">
              Total Inspections
            </span>
            <span className="text-3xl font-bold">{totalInspections}</span>
            <span className="text-xs text-muted-foreground">
              {hasRealData ? 'All time inspections' : 'No inspections yet'}
            </span>
          </div>
          <div className="flex flex-col items-center justify-center rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
            <span className="text-sm font-medium text-muted-foreground">
              Average Score
            </span>
            <span className="text-3xl font-bold">{averageScore}%</span>
            <span className="text-xs text-muted-foreground">
              {hasRealData ? 'Across all inspections' : 'No scores yet'}
            </span>
          </div>
          <div className="flex flex-col items-center justify-center rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
            <span className="text-sm font-medium text-muted-foreground">
              Failed Inspections
            </span>
            <span className="text-3xl font-bold">{openIssues}</span>
            <span className="text-xs text-muted-foreground">
              {hasRealData ? 'Requiring attention' : 'No issues yet'}
            </span>
          </div>
          <div className="flex flex-col items-center justify-center rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
            <span className="text-sm font-medium text-muted-foreground">
              Pass Rate
            </span>
            <span className="text-3xl font-bold">{actionCompletion}%</span>
            <span className="text-xs text-muted-foreground">
              {hasRealData ? 'Success rate' : 'No data yet'}
            </span>
          </div>
        </div>

        {/* Charts */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Inspection Trends Chart */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Inspection Trends</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={inspectionTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="completed" fill="#8884d8" />
                  <Bar dataKey="passed" fill="#82ca9d" />
                  <Bar dataKey="failed" fill="#ff8042" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            {!hasTrendsData && (
              <p className="text-sm text-muted-foreground text-center">
                No trend data available. Complete inspections to see trends.
              </p>
            )}
          </div>

          {/* Issues by Category Chart */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Issues by Category</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={issuesByCategory}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name}: ${(percent! * 100).toFixed(0)}%`
                    }
                  >
                    {issuesByCategory.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {!hasIssuesData && (
              <p className="text-sm text-muted-foreground text-center">
                No issues data available. Report issues to see category
                breakdown.
              </p>
            )}
          </div>
        </div>

        {/* Action Completion Rate Chart */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Action Completion Rate</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={actionCompletionRate}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="rate"
                  stroke="#8884d8"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          {!hasRealData && (
            <p className="text-sm text-muted-foreground text-center">
              No action data available. Create actions to see completion rates.
            </p>
          )}
        </div>

        <div className="flex justify-center">
          <Button asChild>
            <Link href="/dashboard/analytics">View Full Analytics</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
