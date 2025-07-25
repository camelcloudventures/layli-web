import { Suspense } from 'react'
import AnalyticsClient from './client'
import AnalyticsLoading from './loading'
import {
  getAnalyticsSummary,
  getIssuesAnalytics,
  getActionsAnalytics,
  getSchedulesAnalytics,
  getInspectionsAnalytics,
} from './actions/actions'

export default async function AnalyticsPage() {
  // Fetch all analytics data in parallel
  const [summary, issues, actions, schedules, inspections] = await Promise.all([
    getAnalyticsSummary(),
    getIssuesAnalytics(),
    getActionsAnalytics(),
    getSchedulesAnalytics(),
    getInspectionsAnalytics(),
  ])

  return (
    <Suspense fallback={<AnalyticsLoading />}>
      <AnalyticsClient
        summary={summary}
        issues={issues}
        actions={actions}
        schedules={schedules}
        inspections={inspections}
      />
    </Suspense>
  )
}

export const dynamic = 'force-dynamic'
