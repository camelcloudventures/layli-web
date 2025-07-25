import { format } from 'date-fns'
import { formatDate } from '@/lib/utils'

interface AuditSummaryData {
  totalInspections: number
  completedInspections: number
  pendingInspections: number
  totalIssues: number
  resolvedIssues: number
  recentInspections: Array<{
    id: number
    title: string
    status: string
    date: string
    assignedTo: string
  }>
}

interface AuditSummaryReportProps {
  data?: AuditSummaryData
}

export function AuditSummaryReport({ data }: AuditSummaryReportProps) {
  const currentDate = new Date()

  // Use real data or fallback to mock data if not available
  const reportData = data || {
    totalInspections: 24,
    completedInspections: 16,
    pendingInspections: 7,
    totalIssues: 32,
    resolvedIssues: 21,
    recentInspections: [
      {
        id: 1,
        title: 'Annual Financial Audit',
        status: 'completed',
        date: '2023-04-15',
        assignedTo: 'Sarah Williams',
      },
      {
        id: 2,
        title: 'Security Compliance Check',
        status: 'in-progress',
        date: '2023-04-20',
        assignedTo: 'Alex Johnson',
      },
      {
        id: 3,
        title: 'Operational Audit Q1',
        status: 'pending',
        date: '2023-04-25',
        assignedTo: 'Miguel Rodriguez',
      },
      {
        id: 4,
        title: 'Vendor Assessment Review',
        status: 'completed',
        date: '2023-04-10',
        assignedTo: 'Priya Patel',
      },
      {
        id: 5,
        title: 'Internal Controls Evaluation',
        status: 'pending',
        date: '2023-04-28',
        assignedTo: 'Jordan Smith',
      },
    ],
  }

  // Calculate changes (mock for now since we don't have historical data)
  const changes = {
    totalInspections: '+12%',
    completedInspections: '+6',
    pendingInspections: '+3',
    totalIssues: '+8',
    resolvedIssues: '+5',
  }

  return (
    <div id="audit-summary-report" className="">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">Audit Summary Report</h1>
        <p className="text-gray-500">
          Generated on {format(currentDate, 'MMMM d, yyyy')}
        </p>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Executive Summary</h2>
        <p className="mb-4">
          This report provides an overview of all audit activities conducted
          within the organization. It summarizes key findings, trends, and
          recommendations based on completed audits.
        </p>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Audit Statistics</h2>
        <table className="w-full border-collapse mb-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">Metric</th>
              <th className="border p-2 text-left">Value</th>
              <th className="border p-2 text-left">Change</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border p-2">Total Inspections</td>
              <td className="border p-2">{reportData.totalInspections}</td>
              <td className="border p-2 text-green-600">
                {changes.totalInspections}
              </td>
            </tr>
            <tr>
              <td className="border p-2">Completed Inspections</td>
              <td className="border p-2">{reportData.completedInspections}</td>
              <td className="border p-2 text-green-600">
                {changes.completedInspections}
              </td>
            </tr>
            <tr>
              <td className="border p-2">Pending Inspections</td>
              <td className="border p-2">{reportData.pendingInspections}</td>
              <td className="border p-2 text-yellow-600">
                {changes.pendingInspections}
              </td>
            </tr>
            <tr>
              <td className="border p-2">Issues Identified</td>
              <td className="border p-2">{reportData.totalIssues}</td>
              <td className="border p-2 text-red-600">{changes.totalIssues}</td>
            </tr>
            <tr>
              <td className="border p-2">Issues Resolved</td>
              <td className="border p-2">{reportData.resolvedIssues}</td>
              <td className="border p-2 text-green-600">
                {changes.resolvedIssues}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Recent Inspections</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">Inspection Title</th>
              <th className="border p-2 text-left">Status</th>
              <th className="border p-2 text-left">Date</th>
              <th className="border p-2 text-left">Assigned To</th>
            </tr>
          </thead>
          <tbody>
            {reportData.recentInspections.map((inspection) => (
              <tr key={inspection.id}>
                <td className="border p-2">{inspection.title}</td>
                <td className="border p-2 capitalize">{inspection.status}</td>
                <td className="border p-2">{formatDate(inspection.date)}</td>
                <td className="border p-2">{inspection.assignedTo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Recommendations</h2>
        <ul className="list-disc pl-5">
          <li className="mb-1">
            Increase frequency of security compliance checks
          </li>
          <li className="mb-1">
            Implement automated testing for operational audits
          </li>
          <li className="mb-1">Enhance vendor assessment criteria</li>
          <li className="mb-1">
            Provide additional training for audit team members
          </li>
        </ul>
      </div>

      <div className="text-xs text-gray-500 mt-8 pt-4 border-t">
        <p>Confidential: For internal use only</p>
        <p>© {currentDate.getFullYear()} Audit Management System</p>
      </div>
    </div>
  )
}
