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

type IProps = {
  inspectionTrends: {
    month: string
    completed: number
    passed: number
    failed: number
  }[]
  issuesByCategory: {
    category: string
    count: number
  }[]
  actionCompletionRate: {
    month: string
    rate: number
  }[]
}
export default function Analytics({
  inspectionTrends,
  issuesByCategory,
  actionCompletionRate,
}: IProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Analytics</CardTitle>
        <CardDescription>
          View detailed analytics about your audit activities
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="flex flex-col items-center justify-center rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
            <span className="text-sm font-medium text-muted-foreground">
              Total Inspections
            </span>
            <span className="text-3xl font-bold">112</span>
            <span className="text-xs text-green-600">
              +18% from previous period
            </span>
          </div>
          <div className="flex flex-col items-center justify-center rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
            <span className="text-sm font-medium text-muted-foreground">
              Average Score
            </span>
            <span className="text-3xl font-bold">83%</span>
            <span className="text-xs text-green-600">
              +5% from previous period
            </span>
          </div>
          <div className="flex flex-col items-center justify-center rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
            <span className="text-sm font-medium text-muted-foreground">
              Open Issues
            </span>
            <span className="text-3xl font-bold">24</span>
            <span className="text-xs text-green-600">
              -12% from previous period
            </span>
          </div>
          <div className="flex flex-col items-center justify-center rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
            <span className="text-sm font-medium text-muted-foreground">
              Action Completion
            </span>
            <span className="text-3xl font-bold">78%</span>
            <span className="text-xs text-green-600">
              +8% from previous period
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
