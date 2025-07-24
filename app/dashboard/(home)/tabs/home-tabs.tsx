'use client'

import { Tabs } from '@/components/ui/tabs'

import { useState } from 'react'
import TabSelector from './tab-selector'
import Analytics from './analytics'
import Reports from './reports'
import Notifications from './notifications'
import Overview from './overview'
import { Notification } from '@/lib/types/notifications'

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
    category: string
    count: number
  }[]
  actionCompletionRate: {
    month: string
    rate: number
  }[]
}

export default function HomeTabs({
  stats,
  notifications,
  inspectionTrends,
  issuesByCategory,
  actionCompletionRate,
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
          />
        )
      case 'reports':
        return (
          <Reports
            reportDialogState={reportDialogState}
            setReportDialogState={setReportDialogState}
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
