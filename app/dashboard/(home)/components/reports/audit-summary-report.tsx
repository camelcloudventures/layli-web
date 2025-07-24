import { format } from 'date-fns'

export function AuditSummaryReport() {
  const currentDate = new Date()

  return (
    <div
      id="audit-summary-report"
      className="p-8 bg-white text-black"
      style={{ width: '800px' }}
    >
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
              <td className="border p-2">Total Audits</td>
              <td className="border p-2">24</td>
              <td className="border p-2 text-green-600">+12%</td>
            </tr>
            <tr>
              <td className="border p-2">Completed Audits</td>
              <td className="border p-2">16</td>
              <td className="border p-2 text-green-600">+6</td>
            </tr>
            <tr>
              <td className="border p-2">Pending Audits</td>
              <td className="border p-2">7</td>
              <td className="border p-2 text-yellow-600">+3</td>
            </tr>
            <tr>
              <td className="border p-2">Issues Identified</td>
              <td className="border p-2">32</td>
              <td className="border p-2 text-red-600">+8</td>
            </tr>
            <tr>
              <td className="border p-2">Issues Resolved</td>
              <td className="border p-2">21</td>
              <td className="border p-2 text-green-600">+5</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Recent Audits</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">Audit Title</th>
              <th className="border p-2 text-left">Status</th>
              <th className="border p-2 text-left">Date</th>
              <th className="border p-2 text-left">Assigned To</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border p-2">Annual Financial Audit</td>
              <td className="border p-2">Completed</td>
              <td className="border p-2">Apr 15, 2023</td>
              <td className="border p-2">Sarah Williams</td>
            </tr>
            <tr>
              <td className="border p-2">Security Compliance Check</td>
              <td className="border p-2">In Progress</td>
              <td className="border p-2">Apr 20, 2023</td>
              <td className="border p-2">Alex Johnson</td>
            </tr>
            <tr>
              <td className="border p-2">Operational Audit Q1</td>
              <td className="border p-2">Pending</td>
              <td className="border p-2">Apr 25, 2023</td>
              <td className="border p-2">Miguel Rodriguez</td>
            </tr>
            <tr>
              <td className="border p-2">Vendor Assessment Review</td>
              <td className="border p-2">Completed</td>
              <td className="border p-2">Apr 10, 2023</td>
              <td className="border p-2">Priya Patel</td>
            </tr>
            <tr>
              <td className="border p-2">Internal Controls Evaluation</td>
              <td className="border p-2">Pending</td>
              <td className="border p-2">Apr 28, 2023</td>
              <td className="border p-2">Jordan Smith</td>
            </tr>
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
