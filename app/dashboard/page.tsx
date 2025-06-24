'use client'

import { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  BarChart3,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  Flag,
  Layers,
  ListChecks,
  Plus,
  Search,
  Settings,
  Users,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { StatCard } from './(home)/components/stat-card'
import { AuditItem } from './(home)/components/audit-item'
import { NotificationItem } from './(home)/components/notification-item'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Tooltip,
} from 'recharts'
import { ReportDialog } from './(home)/components/report-dialog'

// Mock user data
const mockUser = {
  fullName: 'Demo User',
  email: 'demo@example.com',
  role: 'admin', // Can be "admin", "auditor", or "supervisor"
  image: '',
}

// Mock statistics data
const mockStats = {
  totalAudits: 24,
  activeUsers: 12,
  pendingAudits: 7,
  completedAudits: 16,
  issuesIdentified: 32,
  issuesResolved: 21,
  upcomingAudits: 5,
  overdueActions: 3,
  complianceScore: 87,
  auditProgress: 68,
}

// Mock recent audits
const mockRecentAudits = [
  {
    id: 1,
    title: 'Annual Financial Audit',
    status: 'completed',
    date: '2023-04-15',
    assignedTo: 'Sarah Williams',
  },
  {
    id: 2,
    title: 'Security Compliance Check',
    status: 'in-progress',
    date: '2023-04-20',
    assignedTo: 'Alex Johnson',
  },
  {
    id: 3,
    title: 'Operational Audit Q1',
    status: 'pending',
    date: '2023-04-25',
    assignedTo: 'Miguel Rodriguez',
  },
  {
    id: 4,
    title: 'Vendor Assessment Review',
    status: 'completed',
    date: '2023-04-10',
    assignedTo: 'Priya Patel',
  },
  {
    id: 5,
    title: 'Internal Controls Evaluation',
    status: 'pending',
    date: '2023-04-28',
    assignedTo: 'Jordan Smith',
  },
]

// Mock notifications
const mockNotifications = [
  {
    id: 1,
    type: 'info',
    message: 'New audit template available',
    time: '1 hour ago',
  },
  {
    id: 2,
    type: 'warning',
    message: '3 actions are overdue',
    time: '5 hours ago',
  },
  {
    id: 3,
    type: 'success',
    message: 'Compliance report approved',
    time: 'Yesterday',
  },
]

// Role-based quick actions
const quickActions = {
  admin: [
    { label: 'Create New Audit', icon: Plus, href: '/dashboard/templates' },
    { label: 'Manage Users', icon: Users, href: '/dashboard/settings' },
    { label: 'System Settings', icon: Settings, href: '/dashboard/settings' },
  ],
  auditor: [
    { label: 'Start New Audit', icon: Plus, href: '/dashboard/templates' },
    { label: 'Review Findings', icon: Search, href: '/dashboard/issues' },
    { label: 'Submit Report', icon: FileText, href: '/dashboard/actions' },
  ],
  supervisor: [
    { label: 'Approve Audits', icon: CheckCircle2, href: '/dashboard/audits' },
    { label: 'Assign Tasks', icon: Users, href: '/dashboard/actions' },
    { label: 'View Reports', icon: BarChart3, href: '/dashboard/analytics' },
  ],
}

// Create button options based on role
const createOptions = {
  admin: [
    {
      label: 'Create Audit Template',
      icon: FileText,
      href: '/dashboard/templates',
    },
    { label: 'Create Schedule', icon: Calendar, href: '/dashboard/schedules' },
    { label: 'Create Action', icon: ListChecks, href: '/dashboard/actions' },
    { label: 'Create User', icon: Users, href: '/dashboard/settings' },
  ],
  auditor: [
    {
      label: 'Create Audit Template',
      icon: FileText,
      href: '/dashboard/templates',
    },
    { label: 'Create Schedule', icon: Calendar, href: '/dashboard/schedules' },
    { label: 'Create Action', icon: ListChecks, href: '/dashboard/actions' },
    { label: 'Report Issue', icon: Flag, href: '/dashboard/issues' },
  ],
  supervisor: [
    {
      label: 'Create Audit Template',
      icon: FileText,
      href: '/dashboard/templates',
    },
    { label: 'Create Schedule', icon: Calendar, href: '/dashboard/schedules' },
    { label: 'Create Action', icon: ListChecks, href: '/dashboard/actions' },
    { label: 'Generate Report', icon: BarChart3, href: '/dashboard/analytics' },
  ],
}

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

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8']

const actionCompletionRate = [
  { month: 'Jan', rate: 65 },
  { month: 'Feb', rate: 70 },
  { month: 'Mar', rate: 75 },
  { month: 'Apr', rate: 80 },
  { month: 'May', rate: 85 },
  { month: 'Jun', rate: 90 },
]

export default function DashboardPage() {
  const [selectedTab, setSelectedTab] = useState('overview')

  const [reportDialogState, setReportDialogState] = useState<{
    open: boolean
    type: 'auditSummary' | 'compliance' | 'issues'
  }>({
    open: false,
    type: 'auditSummary',
  })

  // Role-based quick actions
  const userActions =
    quickActions[mockUser.role as keyof typeof quickActions] ||
    quickActions.auditor

  // Get create options based on user role
  const userCreateOptions =
    createOptions[mockUser.role as keyof typeof createOptions] ||
    createOptions.auditor

  // Number of notifications
  const notificationCount = mockNotifications.length

  return (
    <div className="flex flex-col gap-6">
      {/* Header with Create Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

        {/* Create Button with Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Create
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {userCreateOptions.map((option, index) => (
              <DropdownMenuItem key={index} asChild>
                <Link
                  href={option.href}
                  className="flex items-center cursor-pointer"
                >
                  <option.icon className="mr-2 h-4 w-4" />
                  <span>{option.label}</span>
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Role-based quick actions */}
      <div className="grid gap-4 md:grid-cols-3">
        {userActions.map((action, index) => (
          <Link href={action.href} key={index}>
            <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="rounded-full bg-primary/10 p-2">
                  <action.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{action.label}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Tabs for content */}
      <Tabs
        defaultValue="overview"
        className="space-y-4"
        onValueChange={setSelectedTab}
      >
        <TabsList className="overflow-x-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="notifications" className="relative">
            Notifications
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                {notificationCount}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key metrics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Audits"
              value={mockStats.totalAudits}
              description="+12% from last month"
              icon={FileText}
            />
            <StatCard
              title="Active Users"
              value={mockStats.activeUsers}
              description="+2 new this week"
              icon={Users}
            />
            <StatCard
              title="Pending Audits"
              value={mockStats.pendingAudits}
              description="+3 awaiting review"
              icon={Clock}
            />
            <StatCard
              title="Completed Audits"
              value={mockStats.completedAudits}
              description="+6 this month"
              icon={CheckCircle2}
            />
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
                  <span className="text-2xl font-bold">
                    {mockStats.complianceScore}%
                  </span>
                  <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700"
                  >
                    Good
                  </Badge>
                </div>
                <Progress value={mockStats.complianceScore} className="h-2" />
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
                    <div className="text-2xl font-bold">
                      {mockStats.issuesIdentified}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Total identified
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">
                      {mockStats.issuesResolved}
                    </div>
                    <p className="text-xs text-muted-foreground">Resolved</p>
                  </div>
                </div>
                <Progress
                  value={
                    (mockStats.issuesResolved / mockStats.issuesIdentified) *
                    100
                  }
                  className="h-2"
                />
                <p className="text-xs text-muted-foreground">
                  {(
                    (mockStats.issuesResolved / mockStats.issuesIdentified) *
                    100
                  ).toFixed(0)}
                  % resolution rate
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
                  <span className="text-2xl font-bold">
                    {mockStats.auditProgress}%
                  </span>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    In Progress
                  </Badge>
                </div>
                <Progress value={mockStats.auditProgress} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  Overall completion of active audits
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
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
                            `${name}: ${(percent * 100).toFixed(0)}%`
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
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reports</CardTitle>
              <CardDescription>
                Generate and view reports for your audits
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <Card className="flex flex-col items-center p-4 text-center">
                  <FileText className="h-10 w-10 text-primary mb-2" />
                  <h3 className="font-medium">Audit Summary</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Overview of all audit activities
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-auto"
                    onClick={() =>
                      setReportDialogState({ open: true, type: 'auditSummary' })
                    }
                  >
                    Generate
                  </Button>
                </Card>
                <Card className="flex flex-col items-center p-4 text-center">
                  <Layers className="h-10 w-10 text-primary mb-2" />
                  <h3 className="font-medium">Compliance Report</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Detailed compliance status
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-auto"
                    onClick={() =>
                      setReportDialogState({ open: true, type: 'compliance' })
                    }
                  >
                    Generate
                  </Button>
                </Card>
                <Card className="flex flex-col items-center p-4 text-center">
                  <Flag className="h-10 w-10 text-primary mb-2" />
                  <h3 className="font-medium">Issues Report</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Summary of identified issues
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-auto"
                    onClick={() =>
                      setReportDialogState({ open: true, type: 'issues' })
                    }
                  >
                    Generate
                  </Button>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                Stay updated with the latest activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockNotifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    id={notification.id}
                    type={notification.type as 'info' | 'warning' | 'success'}
                    message={notification.message}
                    time={notification.time}
                  />
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm" className="w-full">
                Mark all as read
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Recent Audits Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Audits</CardTitle>
            <CardDescription>
              A list of your recent audits and their status
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/audits">View all</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockRecentAudits.map((audit) => (
              <AuditItem
                key={audit.id}
                id={audit.id}
                title={audit.title}
                status={audit.status as 'completed' | 'in-progress' | 'pending'}
                date={audit.date}
                assignedTo={audit.assignedTo}
              />
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="ghost" size="sm" className="w-full" asChild>
            <Link href="/dashboard/audits">View all audits</Link>
          </Button>
        </CardFooter>
      </Card>
      <ReportDialog
        open={reportDialogState.open}
        onOpenChange={(open) =>
          setReportDialogState((prev) => ({ ...prev, open }))
        }
        reportType={reportDialogState.type}
      />
    </div>
  )
}
