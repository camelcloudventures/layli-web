'use client'

import { Suspense } from 'react'
import AnalyticsSummary from './components/analytics-summary'
import IssuesAnalytics from './components/issues-analytics'
import ActionsAnalytics from './components/actions-analytics'
import SchedulesAnalytics from './components/schedules-analytics'
import InspectionsAnalytics from './components/inspections-analytics'
import { 
  type AnalyticsSummary as AnalyticsSummaryType,
  type IssuesAnalytics as IssuesAnalyticsType,
  type ActionsAnalytics as ActionsAnalyticsType,
  type SchedulesAnalytics as SchedulesAnalyticsType,
  type InspectionsAnalytics as InspectionsAnalyticsType
} from './actions/actions'

interface AnalyticsClientProps {
  summary: AnalyticsSummaryType | null
  issues: IssuesAnalyticsType | null
  actions: ActionsAnalyticsType | null
  schedules: SchedulesAnalyticsType | null
  inspections: InspectionsAnalyticsType | null
}

export default function AnalyticsClient({ 
  summary, 
  issues, 
  actions, 
  schedules, 
  inspections 
}: AnalyticsClientProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">Comprehensive insights into your audit activities</p>
        </div>
      </div>

      {/* Summary Cards */}
      {summary && (
        <Suspense fallback={<div>Loading summary...</div>}>
          <AnalyticsSummary data={summary} />
        </Suspense>
      )}

      {/* Issues Analytics */}
      {issues && (
        <Suspense fallback={<div>Loading issues analytics...</div>}>
          <IssuesAnalytics data={issues} />
        </Suspense>
      )}

      {/* Actions Analytics */}
      {actions && (
        <Suspense fallback={<div>Loading actions analytics...</div>}>
          <ActionsAnalytics data={actions} />
        </Suspense>
      )}

      {/* Schedules Analytics */}
      {schedules && (
        <Suspense fallback={<div>Loading schedules analytics...</div>}>
          <SchedulesAnalytics data={schedules} />
        </Suspense>
      )}

      {/* Inspections Analytics */}
      {inspections && (
        <Suspense fallback={<div>Loading inspections analytics...</div>}>
          <InspectionsAnalytics data={inspections} />
        </Suspense>
      )}

      {/* Fallback for when no data is available */}
      {!summary && !issues && !actions && !schedules && !inspections && (
        <div className="text-center py-12">
          <p className="text-gray-500">No analytics data available</p>
        </div>
      )}
    </div>
  )
}
