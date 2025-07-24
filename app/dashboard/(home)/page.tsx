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

export const dynamic = 'force-dynamic'

// Mock user data
const mockUser = {
  fullName: 'Demo User',
  email: 'demo@example.com',
  role: 'admin', // Can be "admin", "auditor", or "supervisor"
  image: '',
}

// Mock statistics data

const stats = [
  {
    id: 1,
    title: 'Total Audits',
    value: 24,
    description: '+12% from last month',
    icon: 'FileText',
  },
  {
    id: 2,
    title: 'Active Users',
    value: 12,
    description: '+2 new this week',
    icon: 'Users',
  },

  {
    id: 3,
    title: 'Pending Audits',
    value: 7,
    description: '+3 awaiting review',
    icon: 'Clock',
  },
  {
    id: 4,
    title: 'Completed Audits',
    value: 16,
    description: '+6 this month',
    icon: 'CheckCircle2',
  },

  {
    id: 5,
    title: 'Compliance Score',
    value: 87,
    description: 'Based on completed audits and resolved issues',
    icon: 'CheckCircle2',
  },
  {
    id: 6,
    title: 'Issues',
    value: 32,
    description: '66% resolution rate',
    icon: 'Flag',
  },
  {
    id: 7,
    title: 'Audit Progress',
    value: 68,
    description: 'Overall completion of active audits',
    icon: 'Layers',
  },
  {
    id: 8,
    title: 'Issues resolved',
    value: 21,
    description: '66% resolution rate',
    icon: 'CheckCircle2',
  },
]

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
  { category: 'Safety', count: 35 },
  { category: 'Compliance', count: 25 },
  { category: 'Operational', count: 20 },
  { category: 'Environmental', count: 15 },
  { category: 'Quality', count: 5 },
]

const actionCompletionRate = [
  { month: 'Jan', rate: 65 },
  { month: 'Feb', rate: 70 },
  { month: 'Mar', rate: 75 },
  { month: 'Apr', rate: 80 },
  { month: 'May', rate: 85 },
  { month: 'Jun', rate: 90 },
]

export default async function DashboardPage() {
  const notifications = await getNotifications()

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
      />
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
    </div>
  )
}
