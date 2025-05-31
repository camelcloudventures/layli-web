'use client'

import { useEffect, useCallback } from 'react'
import { useSchedulesStore } from '@/app/store/use-schedules-store'
import { SchedulesList } from './schedules-list'
import type { SchedulesResponse } from '@/lib/types/schedule-types'
import type { UserOption, TemplateOption } from '../types/schedule-form-types'

interface SchedulesProviderProps {
  initialSchedules: SchedulesResponse['data']
}

export function SchedulesProvider({
  initialSchedules,
}: SchedulesProviderProps) {
  const {
    users,
    templates,
    sites,
    isLoadingUsers,
    isLoadingTemplates,
    isLoadingSites,
    error,
    fetchUsers,
    fetchTemplates,
    fetchSites,
  } = useSchedulesStore()

  console.log('Store State:', {
    users: { count: users.length, data: users },
    templates: { count: templates.length, data: templates },
    sites: { count: sites.length, data: sites },
    loadingStates: {
      users: isLoadingUsers,
      templates: isLoadingTemplates,
      sites: isLoadingSites,
    },
  })

  const fetchData = useCallback(async () => {
    console.log('Fetching data...')
    // Only fetch if we don't have the data
    if (users.length === 0) {
      console.log('Fetching users from API...')
      await fetchUsers()
    } else {
      console.log('Using cached users from store')
    }

    if (templates.length === 0) {
      console.log('Fetching templates from API...')
      await fetchTemplates()
    } else {
      console.log('Using cached templates from store')
    }

    if (sites.length === 0) {
      console.log('Fetching sites from API...')
      await fetchSites()
    } else {
      console.log('Using cached sites from store')
    }
  }, [
    users.length,
    templates.length,
    sites.length,
    fetchUsers,
    fetchTemplates,
    fetchSites,
  ])

  useEffect(() => {
    console.log('useEffect triggered')
    fetchData()
  }, [fetchData])

  // Show loading state only if we have no data and are loading
  const isLoading =
    (users.length === 0 && isLoadingUsers) ||
    (templates.length === 0 && isLoadingTemplates) ||
    (sites.length === 0 && isLoadingSites)

  if (isLoading) {
    console.log('Showing loading state')
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
          <div className="h-10 w-32 animate-pulse rounded bg-gray-200" />
        </div>

        <div className="rounded-lg border">
          <div className="divide-y">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="h-4 w-48 animate-pulse rounded bg-gray-200" />
                    <div className="h-3 w-32 animate-pulse rounded bg-gray-200" />
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="h-8 w-24 animate-pulse rounded bg-gray-200" />
                    <div className="h-8 w-24 animate-pulse rounded bg-gray-200" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    console.log('Error state:', error)
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  console.log('Rendering with data from:', {
    users: users.length > 0 ? 'store' : 'API',
    templates: templates.length > 0 ? 'store' : 'API',
    sites: sites.length > 0 ? 'store' : 'API',
  })

  // Transform the data to match the expected types
  const userOptions: UserOption[] = users.map((user) => ({
    user: {
      id: user.id,
      full_name: user.full_name,
      role: user.role,
    },
  }))

  const templateOptions: TemplateOption[] = templates.map((template) => ({
    id: template.id,
    title: template.name,
  }))

  return (
    <SchedulesList
      schedules={initialSchedules}
      users={userOptions}
      templates={templateOptions}
      sites={sites}
    />
  )
}
