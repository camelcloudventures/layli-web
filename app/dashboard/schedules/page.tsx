import { getSchedules } from './actions/actions'
import { SchedulesProvider } from './components/schedules-provider'
import type { SchedulesResponse } from '@/lib/types/schedule-types'

export default async function SchedulesPage() {
  const schedulesResponse = await getSchedules(1)
  const schedules = (schedulesResponse as SchedulesResponse)?.data || []

  return (
    <main className="w-full py-8 px-4">
      <SchedulesProvider initialSchedules={schedules} />
    </main>
  )
}
