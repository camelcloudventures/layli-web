import { format } from 'date-fns'
import { formatDate } from '@/lib/utils'

interface IssuesData {
  totalIssues: number
  resolvedIssues: number
  openIssues: number
  issuesByCategory: Record<string, number>
  criticalIssues: Array<{
    id: string
    title: string
    category: string
    priority: string
    due_at: string
    assignees: Array<{
      id: string
      full_name: string
      email: string
      role: string
    }>
  }>
  topRecurringIssues: Array<{
    title: string
    occurrences: number
  }>
}

interface IssuesReportProps {
  data?: IssuesData
}

export function IssuesReport({ data }: IssuesReportProps) {
  const currentDate = new Date()

  // Use real data or fallback to mock data if not available
  const reportData = data || {
    totalIssues: 32,
    resolvedIssues: 21,
    openIssues: 11,
    issuesByCategory: {
      safety: 12,
      compliance: 8,
      operational: 6,
      environmental: 4,
      quality: 2,
    },
    criticalIssues: [
      {
        id: '1',
        title: 'Fire exit blocked in warehouse',
        category: 'Safety',
        priority: 'high',
        due_at: '2023-04-30',
        assignees: [
          {
            id: '1',
            full_name: 'John Smith',
            email: 'john@example.com',
            role: 'supervisor',
          },
        ],
      },
      {
        id: '2',
        title: 'Missing encryption for data at rest',
        category: 'Compliance',
        priority: 'high',
        due_at: '2023-05-01',
        assignees: [
          {
            id: '2',
            full_name: 'Lisa Chen',
            email: 'lisa@example.com',
            role: 'admin',
          },
        ],
      },
      {
        id: '3',
        title: 'Chemical spill containment inadequate',
        category: 'Environmental',
        priority: 'high',
        due_at: '2023-05-05',
        assignees: [
          {
            id: '3',
            full_name: 'Robert Johnson',
            email: 'robert@example.com',
            role: 'supervisor',
          },
        ],
      },
    ],
    topRecurringIssues: [
      { title: 'Safety equipment not properly maintained', occurrences: 5 },
      { title: 'Documentation incomplete', occurrences: 4 },
      { title: 'Training records outdated', occurrences: 3 },
    ],
  }

  return (
    <div id="issues-report" className="p-8 bg-white text-black w-full ">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">Issues Summary Report</h1>
        <p className="text-gray-500">
          Generated on {format(currentDate, 'MMMM d, yyyy')}
        </p>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Issues Overview</h2>
        <p className="mb-4">
          This report summarizes all identified issues across audits and
          inspections, their current status, and recommended actions.
        </p>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="border p-4 rounded-md text-center">
            <div className="text-2xl font-bold">{reportData.totalIssues}</div>
            <div className="text-sm text-gray-600">Total Issues</div>
          </div>
          <div className="border p-4 rounded-md text-center">
            <div className="text-2xl font-bold text-green-600">
              {reportData.resolvedIssues}
            </div>
            <div className="text-sm text-gray-600">Resolved</div>
          </div>
          <div className="border p-4 rounded-md text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {reportData.openIssues}
            </div>
            <div className="text-sm text-gray-600">Open</div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Issues by Category</h2>
        <table className="w-full border-collapse mb-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">Category</th>
              <th className="border p-2 text-left">Total</th>
              <th className="border p-2 text-left">Open</th>
              <th className="border p-2 text-left">Resolved</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(reportData.issuesByCategory).map(
              ([category, total]) => {
                const resolved = Math.floor(total * 0.65) // Estimate 65% resolved
                const open = total - resolved
                return (
                  <tr key={category}>
                    <td className="border p-2 capitalize">{category}</td>
                    <td className="border p-2">{total}</td>
                    <td className="border p-2">{open}</td>
                    <td className="border p-2">{resolved}</td>
                  </tr>
                )
              },
            )}
          </tbody>
        </table>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Critical Open Issues</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">Issue</th>
              <th className="border p-2 text-left">Category</th>
              <th className="border p-2 text-left">Severity</th>
              <th className="border p-2 text-left">Due Date</th>
              <th className="border p-2 text-left">Assigned To</th>
            </tr>
          </thead>
          <tbody>
            {reportData.criticalIssues.map((issue) => (
              <tr key={issue.id}>
                <td className="border p-2">{issue.title}</td>
                <td className="border p-2">{issue.category}</td>
                <td className="border p-2 text-red-600 capitalize">
                  {issue.priority}
                </td>
                <td className="border p-2">{formatDate(issue.due_at)}</td>
                <td className="border p-2">
                  {issue.assignees[0]?.full_name || 'Unassigned'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Top Recurring Issues</h2>
        <table className="w-full border-collapse mb-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">Issue</th>
              <th className="border p-2 text-left">Occurrences</th>
            </tr>
          </thead>
          <tbody>
            {reportData.topRecurringIssues.map((issue, index) => (
              <tr key={index}>
                <td className="border p-2">{issue.title}</td>
                <td className="border p-2">{issue.occurrences}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Resolution Trends</h2>
        <p>
          Average time to resolution: <strong>8.5 days</strong>
        </p>
        <p>
          Resolution rate:{' '}
          <strong>
            {reportData.totalIssues > 0
              ? Math.round(
                  (reportData.resolvedIssues / reportData.totalIssues) * 100,
                )
              : 0}
            %
          </strong>
        </p>
        <p>
          Improvement from previous period:{' '}
          <strong className="text-green-600">+12%</strong>
        </p>
      </div>

      <div className="text-xs text-gray-500 mt-8 pt-4 border-t">
        <p>Confidential: For internal use only</p>
        <p>© {currentDate.getFullYear()} Audit Management System</p>
      </div>
    </div>
  )
}
