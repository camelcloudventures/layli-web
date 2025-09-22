import { format } from 'date-fns'

export function ComplianceReport() {
  const currentDate = new Date()

  return (
    <div
      id="compliance-report"
      className="p-8 bg-white text-black"
      style={{ width: '800px' }}
    >
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">Compliance Status Report</h1>
        <p className="text-gray-500">
          Generated on {format(currentDate, 'MMMM d, yyyy')}
        </p>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Compliance Overview</h2>
        <p className="mb-4">
          This report provides a detailed analysis of the organization&apos;s
          compliance status across various regulatory frameworks and internal
          policies.
        </p>

        <div className="flex items-center mb-4">
          <div className="w-full bg-gray-200 rounded-full h-4 mr-2">
            <div
              className="bg-green-600 h-4 rounded-full"
              style={{ width: '87%' }}
            ></div>
          </div>
          <span className="text-lg font-bold">87%</span>
        </div>
        <p className="text-sm text-gray-600">
          Overall compliance score based on completed audits and resolved issues
        </p>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Compliance by Framework</h2>
        <table className="w-full border-collapse mb-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">Framework</th>
              <th className="border p-2 text-left">Score</th>
              <th className="border p-2 text-left">Status</th>
              <th className="border p-2 text-left">Last Audit</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border p-2">ISO 27001</td>
              <td className="border p-2">92%</td>
              <td className="border p-2 text-green-600">Compliant</td>
              <td className="border p-2">Mar 15, 2023</td>
            </tr>
            <tr>
              <td className="border p-2">GDPR</td>
              <td className="border p-2">88%</td>
              <td className="border p-2 text-green-600">Compliant</td>
              <td className="border p-2">Feb 22, 2023</td>
            </tr>
            <tr>
              <td className="border p-2">SOC 2</td>
              <td className="border p-2">85%</td>
              <td className="border p-2 text-green-600">Compliant</td>
              <td className="border p-2">Apr 5, 2023</td>
            </tr>
            <tr>
              <td className="border p-2">PCI DSS</td>
              <td className="border p-2">78%</td>
              <td className="border p-2 text-yellow-600">Partial</td>
              <td className="border p-2">Jan 30, 2023</td>
            </tr>
            <tr>
              <td className="border p-2">HIPAA</td>
              <td className="border p-2">95%</td>
              <td className="border p-2 text-green-600">Compliant</td>
              <td className="border p-2">Mar 10, 2023</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Non-Compliance Issues</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">Issue</th>
              <th className="border p-2 text-left">Framework</th>
              <th className="border p-2 text-left">Severity</th>
              <th className="border p-2 text-left">Due Date</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border p-2">
                Incomplete access control documentation
              </td>
              <td className="border p-2">PCI DSS</td>
              <td className="border p-2 text-yellow-600">Medium</td>
              <td className="border p-2">May 15, 2023</td>
            </tr>
            <tr>
              <td className="border p-2">
                Missing encryption for data at rest
              </td>
              <td className="border p-2">PCI DSS</td>
              <td className="border p-2 text-red-600">High</td>
              <td className="border p-2">May 1, 2023</td>
            </tr>
            <tr>
              <td className="border p-2">Outdated privacy policy</td>
              <td className="border p-2">GDPR</td>
              <td className="border p-2 text-yellow-600">Medium</td>
              <td className="border p-2">May 30, 2023</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Recommendations</h2>
        <ul className="list-disc pl-5">
          <li className="mb-1">
            Update PCI DSS documentation for access controls
          </li>
          <li className="mb-1">Implement encryption for all data at rest</li>
          <li className="mb-1">
            Review and update privacy policy to comply with latest GDPR
            requirements
          </li>
          <li className="mb-1">
            Schedule quarterly compliance reviews for all frameworks
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
