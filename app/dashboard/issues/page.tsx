import { getActiveUsers } from '../schedules/actions/actions'
import Issues from './components/issues'
import { getIssues } from './actions/actions'
import IssuesTable from './components/issues-table'
import IssueSearch from './components/issue-search'

export default async function IssuesPage() {
  const users = await getActiveUsers()
  const issues = await getIssues()

  // Map users to the expected format for assignees
  const assignees =
    users?.data?.map((user) => ({
      id: user.user.id,
      full_name: user.user.full_name,
      email: user.user.email,
      role: user.user.role,
    })) || []

  console.log('issues', issues?.data.length)
  return (
    <div className="space-y-4">
      <Issues users={users?.data || []} />
      <IssueSearch />
      <IssuesTable issues={issues?.data || []} assignees={assignees} />
    </div>
  )
}
