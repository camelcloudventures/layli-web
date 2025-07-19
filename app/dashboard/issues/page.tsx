import { DataTable } from '@/components/custom/data-table'
import { getActiveUsers } from '../schedules/actions/actions'
import Issues from './components/issues'
import { getIssues } from './actions/actions'
import { columns } from './components/columns'
import IssueSearch from './components/issue-search'

export default async function IssuesPage() {
  const users = await getActiveUsers()
  const issues = await getIssues()
  return (
    <div className="space-y-4">
      <Issues users={users?.data || []} />
      <IssueSearch />
      <DataTable columns={columns} data={issues?.data || []} border />
    </div>
  )
}
