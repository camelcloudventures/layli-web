import {
  getSchedules,
  getActiveUsers,
  getTemplates,
  getSites,
} from './actions/actions'
import { SchedulesList } from './components/schedules-list'

export const dynamic = 'force-dynamic'

export default async function SchedulesPage() {
  const schedulesResponse = await getSchedules(1)
  const schedules = schedulesResponse?.data || []

  // console.log('schedules', schedules)
  const users = await getActiveUsers()
  const templates = await getTemplates()
  const sites = await getSites()
  // console.log('users', users)

  return (
    <main className="w-full py-8 px-4">
      <SchedulesList
        schedules={schedules}
        // @ts-expect-error - users is an array of objects
        users={users?.data || []}
        // @ts-expect-error - templates is an array of objects
        templates={templates?.data || []}
        sites={sites || []}
      />
    </main>
  )
}
