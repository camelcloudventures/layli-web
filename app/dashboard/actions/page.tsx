import { getUsers } from '@/app/auth/actions/actions'
import { getActions } from './actions/actions'
import Actions from './components/actions'

export default async function ActionsPage() {
  const actions = await getActions()
  const users = await getUsers()
  return <Actions actions={actions?.data ?? []} users={users?.data ?? []} />
}
