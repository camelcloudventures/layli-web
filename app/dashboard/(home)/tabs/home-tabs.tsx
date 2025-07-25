'use client'

import { Tabs } from '@/components/ui/tabs'

import { useState } from 'react'
import TabSelector from './tab-selector'
import Analytics from './analytics'
import Reports from './reports'
import Notifications from './notifications'
import Overview from './overview'
import { Notification } from '@/lib/types/notifications'
import { type AnalyticsSummary } from '../../analytics/actions/actions'

type IProps = {
  stats: {
    id: number
    title: string
    value: number
    description: string
    icon: string
  }[]
  notifications: Notification[]
  inspectionTrends: {
    month: string
    completed: number
    passed: number
    failed: number
  }[]
  issuesByCategory: {
    name: string
    value: number
  }[]
  actionCompletionRate: {
    month: string
    rate: number
  }[]
  summary?: AnalyticsSummary | null
  reportData?: {
    auditSummary: {
      totalInspections: number
      completedInspections: number
      pendingInspections: number
      totalIssues: number
      resolvedIssues: number
      recentInspections: Array<{
        id: number
        title: string
        status: string
        date: string
        assignedTo: string
      }>
    }
    issues: {
      totalIssues: number
      resolvedIssues: number
      openIssues: number
      issuesByCategory: Record<string, number>
      criticalIssues: Array<{
        id: string
        title: string
        category: string
        priority: string
        due_at: string
        assignees: Array<{
          id: string
          full_name: string
          email: string
          role: string
        }>
      }>
      topRecurringIssues: Array<{
        title: string
        occurrences: number
      }>
    }
  }
}

export default function HomeTabs({
  stats,
  notifications,
  inspectionTrends,
  issuesByCategory,
  actionCompletionRate,
  summary,
  reportData,
}: IProps) {
  const [selectedTab, setSelectedTab] = useState('overview')
  const [reportDialogState, setReportDialogState] = useState<{
    open: boolean
    type: 'auditSummary' | 'compliance' | 'issues'
  }>({
    open: false,
    type: 'auditSummary',
  })
  const notificationCount = notifications?.filter((n) => !n.is_read).length

  const tabs = [
    {
      label: 'Overview',
      value: 'overview',
    },
    {
      label: 'Analytics',
      value: 'analytics',
    },
    {
      label: 'Reports',
      value: 'reports',
    },
    {
      label: 'Notifications',
      value: 'notifications',
    },
  ]

  function renderTabContent() {
    switch (selectedTab) {
      case 'analytics':
        return (
          <Analytics
            inspectionTrends={inspectionTrends}
            issuesByCategory={issuesByCategory}
            actionCompletionRate={actionCompletionRate}
            summary={summary}
          />
        )
      case 'reports':
        return (
          <Reports
            reportDialogState={reportDialogState}
            setReportDialogState={setReportDialogState}
            reportData={reportData}
          />
        )
      case 'notifications':
        return <Notifications notifications={notifications} />
      default:
        return <Overview stats={stats} />
    }
  }

  return (
    <div className="w-full">
      <Tabs
        defaultValue="overview"
        className="space-y-4 "
        onValueChange={setSelectedTab}
      >
        <TabSelector tabs={tabs} notificationCount={notificationCount} />
        {renderTabContent()}
      </Tabs>
    </div>
  )
}
