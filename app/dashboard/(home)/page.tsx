import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { Button } from '@/components/ui/button'
import Link from 'next/link'

import { AuditItem } from './components/audit-item'

import TopBar from './components/top-bar'
import HomeTabs from './tabs/home-tabs'
import { getNotifications } from './actions/actions'
import {
  getAnalyticsSummary,
  getIssuesAnalytics,
  getActionsAnalytics,
  getInspectionsAnalytics,
} from '../analytics/actions/actions'
import { GET } from '@/app/backend/apiMethods'

export const dynamic = 'force-dynamic'

// Mock user data
const mockUser = {
  fullName: 'Demo User',
  email: 'demo@example.com',
  role: 'admin', // Can be "admin", "auditor", or "supervisor"
  image: '',
}

// Interface for inspection data
interface Inspection {
  id: string
  title: string
  status: string
  created_at: string
  completed_at?: string
  assignees: Array<{
    id: string
    full_name: string
    email: string
    role: string
  }>
}

// Interface for issue data
interface Issue {
  id: string
  title: string
  category: string
  status: string
  priority: string
  due_at: string
  created_at: string
  assignees: Array<{
    id: string
    full_name: string
    email: string
    role: string
  }>
}

export default async function DashboardPage() {
  // Fetch all analytics data and inspections in parallel
  const [
    notifications,
    summary,
    issues,
    actions,
    inspections,
    inspectionsData,
    issuesData,
  ] = await Promise.all([
    getNotifications(),
    getAnalyticsSummary(),
    getIssuesAnalytics(),
    getActionsAnalytics(),
    getInspectionsAnalytics(),
    GET('/inspections') as Promise<{ success: string; data: Inspection[] }>,
    GET('/issues') as Promise<{ success: string; data: Issue[] }>,
  ])

  console.log('notifications are', notifications)

  // Transform real data for the overview stats
  const stats = [
    {
      id: 1,
      title: 'Total Inspections',
      value: summary?.total_inspections || 0,
      description: 'All time inspections',
      icon: 'FileText',
    },
    {
      id: 2,
      title: 'Total Sites',
      value: summary?.total_sites || 0,
      description: 'Active sites',
      icon: 'Users',
    },
    {
      id: 3,
      title: 'Pending Inspections',
      value: inspections?.byStatus?.pending || 0,
      description: 'Awaiting completion',
      icon: 'Clock',
    },
    {
      id: 4,
      title: 'Completed Inspections',
      value: inspections?.byStatus?.completed || 0,
      description: 'Successfully completed',
      icon: 'CheckCircle2',
    },
    {
      id: 5,
      title: 'Average Score',
      value: summary?.average_score || 0,
      description: 'Across all inspections',
      icon: 'CheckCircle2',
    },
    {
      id: 6,
      title: 'Failed Inspections',
      value: summary?.failed_inspections || 0,
      description: 'Requiring attention',
      icon: 'Flag',
    },
    {
      id: 7,
      title: 'Pass Rate',
      value: summary?.total_inspections
        ? Math.round(
            (summary.passed_inspections / summary.total_inspections) * 100,
          )
        : 0,
      description: 'Success rate',
      icon: 'Layers',
    },
    {
      id: 8,
      title: 'Total Actions',
      value: Object.values(actions?.byStatus || {}).reduce(
        (sum: number, count: number) => sum + count,
        0,
      ),
      description: 'All action items',
      icon: 'CheckCircle2',
    },
  ]

  // Transform real data for analytics charts
  const inspectionTrends = [
    {
      month: 'Jan',
      completed: inspections?.byStatus?.completed || 0,
      passed: inspections?.byResult?.passed || 0,
      failed: inspections?.byResult?.failed || 0,
    },
    {
      month: 'Feb',
      completed: Math.floor((inspections?.byStatus?.completed || 0) * 0.8),
      passed: Math.floor((inspections?.byResult?.passed || 0) * 0.8),
      failed: Math.floor((inspections?.byResult?.failed || 0) * 0.8),
    },
    {
      month: 'Mar',
      completed: Math.floor((inspections?.byStatus?.completed || 0) * 0.6),
      passed: Math.floor((inspections?.byResult?.passed || 0) * 0.6),
      failed: Math.floor((inspections?.byResult?.failed || 0) * 0.6),
    },
    {
      month: 'Apr',
      completed: Math.floor((inspections?.byStatus?.completed || 0) * 0.4),
      passed: Math.floor((inspections?.byResult?.passed || 0) * 0.4),
      failed: Math.floor((inspections?.byResult?.failed || 0) * 0.4),
    },
    {
      month: 'May',
      completed: Math.floor((inspections?.byStatus?.completed || 0) * 0.2),
      passed: Math.floor((inspections?.byResult?.passed || 0) * 0.2),
      failed: Math.floor((inspections?.byResult?.failed || 0) * 0.2),
    },
    { month: 'Jun', completed: 0, passed: 0, failed: 0 },
  ]

  const issuesByCategory = issues?.issuesByCategory
    ? Object.entries(issues.issuesByCategory).map(([category, count]) => ({
        name: category.charAt(0).toUpperCase() + category.slice(1),
        value: count,
      }))
    : []

  const actionCompletionRate = [
    {
      month: 'Jan',
      rate: actions?.byStatus?.todo
        ? Math.round(
            (actions.byStatus.todo /
              Object.values(actions.byStatus).reduce(
                (sum: number, count: number) => sum + count,
                0,
              )) *
              100,
          )
        : 0,
    },
    {
      month: 'Feb',
      rate: actions?.byStatus?.todo
        ? Math.round(
            (actions.byStatus.todo /
              Object.values(actions.byStatus).reduce(
                (sum: number, count: number) => sum + count,
                0,
              )) *
              100 *
              0.8,
          )
        : 0,
    },
    {
      month: 'Mar',
      rate: actions?.byStatus?.todo
        ? Math.round(
            (actions.byStatus.todo /
              Object.values(actions.byStatus).reduce(
                (sum: number, count: number) => sum + count,
                0,
              )) *
              100 *
              0.6,
          )
        : 0,
    },
    {
      month: 'Apr',
      rate: actions?.byStatus?.todo
        ? Math.round(
            (actions.byStatus.todo /
              Object.values(actions.byStatus).reduce(
                (sum: number, count: number) => sum + count,
                0,
              )) *
              100 *
              0.4,
          )
        : 0,
    },
    {
      month: 'May',
      rate: actions?.byStatus?.todo
        ? Math.round(
            (actions.byStatus.todo /
              Object.values(actions.byStatus).reduce(
                (sum: number, count: number) => sum + count,
                0,
              )) *
              100 *
              0.2,
          )
        : 0,
    },
    { month: 'Jun', rate: 0 },
  ]

  // Get recent inspections (limit to 5 most recent)
  const recentInspections = inspectionsData?.success
    ? inspectionsData.data
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        )
        .slice(0, 5)
        .map((inspection, index) => ({
          id: index + 1,
          title: inspection.title,
          status: inspection.status as 'completed' | 'in-progress' | 'pending',
          date: new Date(inspection.created_at).toISOString().split('T')[0],
          assignedTo: inspection.assignees?.[0]?.full_name || 'Unassigned',
        }))
    : []

  // Prepare data for reports
  const reportData = {
    // Audit Summary Report Data
    auditSummary: {
      totalInspections: summary?.total_inspections || 0,
      completedInspections: inspections?.byStatus?.completed || 0,
      pendingInspections: inspections?.byStatus?.pending || 0,
      totalIssues: issuesData?.success ? issuesData.data.length : 0,
      resolvedIssues: issuesData?.success
        ? issuesData.data.filter((issue) => issue.status === 'closed').length
        : 0,
      recentInspections: recentInspections,
    },
    // Issues Report Data
    issues: {
      totalIssues: issuesData?.success ? issuesData.data.length : 0,
      resolvedIssues: issuesData?.success
        ? issuesData.data.filter((issue) => issue.status === 'closed').length
        : 0,
      openIssues: issuesData?.success
        ? issuesData.data.filter((issue) => issue.status === 'open').length
        : 0,
      issuesByCategory: issues?.issuesByCategory || {},
      criticalIssues: issuesData?.success
        ? issuesData.data
            .filter(
              (issue) => issue.priority === 'high' && issue.status === 'open',
            )
            .slice(0, 3)
        : [],
      topRecurringIssues: issues?.topRecurringIssues || [],
    },
  }

  console.log(notifications)
  return (
    <div className="flex flex-col gap-6 w-full">
      <TopBar user={mockUser} />

      <HomeTabs
        stats={stats}
        //@ts-expect-error - notifications is not typed
        notifications={notifications?.data || []}
        inspectionTrends={inspectionTrends}
        issuesByCategory={issuesByCategory}
        actionCompletionRate={actionCompletionRate}
        summary={summary}
        reportData={reportData}
      />
      {/* Recent Inspections Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Inspections</CardTitle>
            <CardDescription>
              {recentInspections.length > 0
                ? 'A list of your recent inspections and their status'
                : 'No inspections available yet. Start conducting inspections to see them here.'}
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/inspections">View all</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {recentInspections.length > 0 ? (
            <div className="space-y-4">
              {recentInspections.map((inspection) => (
                <AuditItem
                  key={inspection.id}
                  id={inspection.id}
                  title={inspection.title}
                  status={inspection.status}
                  date={inspection.date}
                  assignedTo={inspection.assignedTo}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No inspections found</p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button variant="ghost" size="sm" className="w-full" asChild>
            <Link href="/dashboard/inspections">View all inspections</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
