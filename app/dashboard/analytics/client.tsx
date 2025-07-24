'use client'

import { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  FileCheck,
  FileWarning,
  ListChecks,
  TrendingUp,
} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { StatCard } from '../(home)/components/stat-card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

// Mock data for analytics
const inspectionTrends = [
  { month: 'Jan', completed: 12, failed: 3, passed: 9 },
  { month: 'Feb', completed: 15, failed: 4, passed: 11 },
  { month: 'Mar', completed: 18, failed: 2, passed: 16 },
  { month: 'Apr', completed: 22, failed: 5, passed: 17 },
  { month: 'May', completed: 20, failed: 3, passed: 17 },
  { month: 'Jun', completed: 25, failed: 4, passed: 21 },
]

const issuesByCategory = [
  { name: 'Safety', value: 35 },
  { name: 'Compliance', value: 25 },
  { name: 'Operational', value: 20 },
  { name: 'Environmental', value: 15 },
  { name: 'Quality', value: 5 },
]

const actionCompletionRate = [
  { month: 'Jan', rate: 65 },
  { month: 'Feb', rate: 70 },
  { month: 'Mar', rate: 75 },
  { month: 'Apr', rate: 80 },
  { month: 'May', rate: 85 },
  { month: 'Jun', rate: 90 },
]

const locationPerformance = [
  { name: 'Main Factory', score: 85 },
  { name: 'Warehouse A', score: 78 },
  { name: 'Office Building', score: 92 },
  { name: 'Distribution Center', score: 70 },
  { name: 'Research Lab', score: 88 },
]

const topIssues = [
  { issue: 'Missing guardrails', count: 12, category: 'Safety' },
  { issue: 'Improper waste disposal', count: 9, category: 'Environmental' },
  { issue: 'Expired certifications', count: 8, category: 'Compliance' },
  { issue: 'Equipment maintenance overdue', count: 7, category: 'Operational' },
  { issue: 'Inadequate lighting', count: 6, category: 'Safety' },
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8']

export default function AnalyticsClient() {
  const [timeRange, setTimeRange] = useState('6m')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            View audit analytics and insights
          </p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1m">Last Month</SelectItem>
            <SelectItem value="3m">Last 3 Months</SelectItem>
            <SelectItem value="6m">Last 6 Months</SelectItem>
            <SelectItem value="1y">Last Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Inspections"
          value="112"
          description="Last 6 months"
          icon={FileCheck}
          trend={{ value: '+18% from previous period', positive: true }}
        />
        <StatCard
          title="Average Score"
          value="83%"
          description="Across all inspections"
          icon={CheckCircle}
          trend={{ value: '+5% from previous period', positive: true }}
        />
        <StatCard
          title="Open Issues"
          value="24"
          description="Requiring attention"
          icon={AlertTriangle}
          trend={{ value: '-12% from previous period', positive: true }}
        />
        <StatCard
          title="Action Completion"
          value="78%"
          description="On-time completion rate"
          icon={Clock}
          trend={{ value: '+8% from previous period', positive: true }}
        />
      </div>

      {/* Tabs for different analytics views */}
      <Tabs defaultValue="inspections" className="space-y-4">
        <TabsList>
          <TabsTrigger value="inspections">Inspections</TabsTrigger>
          <TabsTrigger value="issues">Issues</TabsTrigger>
          <TabsTrigger value="actions">Actions</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
        </TabsList>

        {/* Inspections Tab */}
        <TabsContent value="inspections" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Inspection Trends</CardTitle>
                <CardDescription>
                  Number of inspections over time
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ChartContainer
                  config={{
                    completed: {
                      label: 'Completed',
                      color: 'hsl(var(--chart-1))',
                    },
                    passed: {
                      label: 'Passed',
                      color: 'hsl(var(--chart-2))',
                    },
                    failed: {
                      label: 'Failed',
                      color: 'hsl(var(--chart-3))',
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={inspectionTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar dataKey="completed" fill="var(--color-completed)" />
                      <Bar dataKey="passed" fill="var(--color-passed)" />
                      <Bar dataKey="failed" fill="var(--color-failed)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pass/Fail Distribution</CardTitle>
                <CardDescription>
                  Inspection outcomes by category
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ChartContainer
                  config={{
                    Safety: {
                      label: 'Safety',
                      color: COLORS[0],
                    },
                    Compliance: {
                      label: 'Compliance',
                      color: COLORS[1],
                    },
                    Operational: {
                      label: 'Operational',
                      color: COLORS[2],
                    },
                    Environmental: {
                      label: 'Environmental',
                      color: COLORS[3],
                    },
                    Quality: {
                      label: 'Quality',
                      color: COLORS[4],
                    },
                  }}
                >
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
                          `${name}: ${(percent ?? 0 * 100).toFixed(0)}%`
                        }
                      >
                        {issuesByCategory.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <ChartTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Issues Tab */}
        <TabsContent value="issues" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Issues by Category</CardTitle>
                <CardDescription>
                  Distribution of issues by type
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ChartContainer
                  config={{
                    Safety: {
                      label: 'Safety',
                      color: COLORS[0],
                    },
                    Compliance: {
                      label: 'Compliance',
                      color: COLORS[1],
                    },
                    Operational: {
                      label: 'Operational',
                      color: COLORS[2],
                    },
                    Environmental: {
                      label: 'Environmental',
                      color: COLORS[3],
                    },
                    Quality: {
                      label: 'Quality',
                      color: COLORS[4],
                    },
                  }}
                >
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
                          `${name}: ${(percent ?? 0 * 100).toFixed(0)}%`
                        }
                      >
                        {issuesByCategory.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <ChartTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Recurring Issues</CardTitle>
                <CardDescription>
                  Most frequently identified problems
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topIssues.map((issue, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                          {index + 1}
                        </span>
                        <div>
                          <p className="font-medium">{issue.issue}</p>
                          <p className="text-sm text-muted-foreground">
                            {issue.category}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {issue.count} occurrences
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Actions Tab */}
        <TabsContent value="actions" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Action Completion Rate</CardTitle>
                <CardDescription>
                  Percentage of actions completed on time
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ChartContainer
                  config={{
                    rate: {
                      label: 'Completion Rate',
                      color: 'hsl(var(--chart-1))',
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={actionCompletionRate}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis domain={[0, 100]} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="rate"
                        stroke="var(--color-rate)"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Action Status</CardTitle>
                <CardDescription>Current status of all actions</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="flex flex-col items-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                      <Clock className="h-8 w-8" />
                    </div>
                    <h3 className="mt-2 text-2xl font-bold">42</h3>
                    <p className="text-sm text-muted-foreground">Pending</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                      <TrendingUp className="h-8 w-8" />
                    </div>
                    <h3 className="mt-2 text-2xl font-bold">28</h3>
                    <p className="text-sm text-muted-foreground">In Progress</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
                      <CheckCircle className="h-8 w-8" />
                    </div>
                    <h3 className="mt-2 text-2xl font-bold">86</h3>
                    <p className="text-sm text-muted-foreground">Completed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Locations Tab */}
        <TabsContent value="locations" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Location Performance</CardTitle>
                <CardDescription>
                  Average inspection scores by location
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ChartContainer
                  config={{
                    score: {
                      label: 'Score',
                      color: 'hsl(var(--chart-1))',
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={locationPerformance}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" domain={[0, 100]} />
                      <YAxis dataKey="name" type="category" width={100} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar dataKey="score" fill="var(--color-score)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Inspection Coverage</CardTitle>
                <CardDescription>
                  Inspection frequency by location
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Main Factory</span>
                      <span className="text-sm text-muted-foreground">
                        24 inspections
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div
                        className="h-2 rounded-full bg-primary"
                        style={{ width: '80%' }}
                      ></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Warehouse A</span>
                      <span className="text-sm text-muted-foreground">
                        18 inspections
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div
                        className="h-2 rounded-full bg-primary"
                        style={{ width: '60%' }}
                      ></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        Office Building
                      </span>
                      <span className="text-sm text-muted-foreground">
                        12 inspections
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div
                        className="h-2 rounded-full bg-primary"
                        style={{ width: '40%' }}
                      ></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        Distribution Center
                      </span>
                      <span className="text-sm text-muted-foreground">
                        30 inspections
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div
                        className="h-2 rounded-full bg-primary"
                        style={{ width: '100%' }}
                      ></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Research Lab</span>
                      <span className="text-sm text-muted-foreground">
                        15 inspections
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div
                        className="h-2 rounded-full bg-primary"
                        style={{ width: '50%' }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Additional Analytics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Compliance Status</CardTitle>
            <CardDescription>Overall compliance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center space-y-2">
              <div className="relative flex h-40 w-40 items-center justify-center rounded-full">
                <svg className="h-40 w-40" viewBox="0 0 100 100">
                  <circle
                    className="stroke-muted"
                    strokeWidth="10"
                    fill="transparent"
                    r="40"
                    cx="50"
                    cy="50"
                  />
                  <circle
                    className="stroke-primary"
                    strokeWidth="10"
                    strokeLinecap="round"
                    fill="transparent"
                    r="40"
                    cx="50"
                    cy="50"
                    strokeDasharray="251.2"
                    strokeDashoffset="50.24"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div className="absolute text-center">
                  <div className="text-3xl font-bold">80%</div>
                  <div className="text-sm text-muted-foreground">Compliant</div>
                </div>
              </div>
              <div className="grid w-full grid-cols-2 gap-2 pt-4">
                <div className="flex flex-col items-center">
                  <div className="text-xl font-bold text-green-600">42</div>
                  <div className="text-xs text-muted-foreground">
                    Compliant Areas
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-xl font-bold text-red-600">8</div>
                  <div className="text-xs text-muted-foreground">
                    Non-compliant Areas
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Risk Assessment</CardTitle>
            <CardDescription>Current risk levels</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">High Risk</span>
                  <span className="text-sm font-medium text-red-600">12%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted">
                  <div
                    className="h-2 rounded-full bg-red-600"
                    style={{ width: '12%' }}
                  ></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Medium Risk</span>
                  <span className="text-sm font-medium text-amber-600">
                    28%
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted">
                  <div
                    className="h-2 rounded-full bg-amber-600"
                    style={{ width: '28%' }}
                  ></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Low Risk</span>
                  <span className="text-sm font-medium text-green-600">
                    60%
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted">
                  <div
                    className="h-2 rounded-full bg-green-600"
                    style={{ width: '60%' }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inspection Efficiency</CardTitle>
            <CardDescription>Time and resource metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">
                    Average Time per Inspection
                  </p>
                  <p className="text-2xl font-bold">42 min</p>
                </div>
                <Clock className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">
                    Inspections per Inspector
                  </p>
                  <p className="text-2xl font-bold">18</p>
                </div>
                <ListChecks className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Issue Resolution Time</p>
                  <p className="text-2xl font-bold">3.2 days</p>
                </div>
                <FileWarning className="h-8 w-8 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
