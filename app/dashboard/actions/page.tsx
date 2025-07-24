import { getActions } from './actions/actions'
import Actions from './components/actions'
import { getActiveUsers, getSites } from '../schedules/actions/actions'

export default async function ActionsPage() {
  const actions = await getActions()
  const users = await getActiveUsers()
  const sites = await getSites()

  return (
    <Actions
      actions={actions?.data ?? []}
      users={users?.data ?? []}
      sites={sites ?? []}
    />
  )
}
