import { getSchedules } from './actions/actions'
import { SchedulesList } from './components/schedules-list'

export default async function SchedulesPage() {
  const schedulesResponse = await getSchedules(1)
  const schedules = schedulesResponse?.data || []

  return (
    <main className="w-full py-8 px-4">
      <SchedulesList schedules={schedules} />
    </main>
  )
}
