'use server'

import { GET } from '@/app/backend/apiMethods'

export interface AnalyticsSummary {
  total_inspections: number
  total_sites: number
  average_score: number
  failed_inspections: number
  passed_inspections: number
}

export interface IssuesAnalytics {
  issuesByCategory: Record<string, number>
  topRecurringIssues: Array<{
    title: string
    occurrences: number
  }>
}

export interface ActionsAnalytics {
  byStatus: Record<string, number>
  byPriority: Record<string, number>
}

export interface SchedulesAnalytics {
  byFrequency: Record<string, number>
}

export interface InspectionsAnalytics {
  byStatus: Record<string, number>
  byResult: Record<string, number>
}

export async function getAnalyticsSummary(): Promise<AnalyticsSummary | null> {
  try {
    const response = (await GET('/analytics/summary')) as {
      success: string
      data: AnalyticsSummary
    }
    if (response.success) {
      return response.data
    }
    return null
  } catch (error) {
    console.error('Error fetching analytics summary:', error)
    return null
  }
}

export async function getIssuesAnalytics(): Promise<IssuesAnalytics | null> {
  try {
    const response = (await GET('/analytics/issues')) as {
      success: string
      data: IssuesAnalytics
    }
    if (response.success) {
      return response.data
    }
    return null
  } catch (error) {
    console.error('Error fetching issues analytics:', error)
    return null
  }
}

export async function getActionsAnalytics(): Promise<ActionsAnalytics | null> {
  try {
    const response = (await GET('/analytics/actions')) as {
      success: string
      data: ActionsAnalytics
    }
    if (response.success) {
      return response.data
    }
    return null
  } catch (error) {
    console.error('Error fetching actions analytics:', error)
    return null
  }
}

export async function getSchedulesAnalytics(): Promise<SchedulesAnalytics | null> {
  try {
    const response = (await GET('/analytics/schedules')) as {
      success: string
      data: SchedulesAnalytics
    }
    if (response.success) {
      return response.data
    }
    return null
  } catch (error) {
    console.error('Error fetching schedules analytics:', error)
    return null
  }
}

export async function getInspectionsAnalytics(): Promise<InspectionsAnalytics | null> {
  try {
    const response = (await GET('/analytics/inspections')) as {
      success: string
      data: InspectionsAnalytics
    }
    if (response.success) {
      return response.data
    }
    return null
  } catch (error) {
    console.error('Error fetching inspections analytics:', error)
    return null
  }
}
