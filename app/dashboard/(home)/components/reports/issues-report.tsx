import { format } from "date-fns"

export function IssuesReport() {
  const currentDate = new Date()

  return (
    <div id="issues-report" className="p-8 bg-white text-black" style={{ width: "800px" }}>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">Issues Summary Report</h1>
        <p className="text-gray-500">Generated on {format(currentDate, "MMMM d, yyyy")}</p>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Issues Overview</h2>
        <p className="mb-4">
          This report summarizes all identified issues across audits and inspections, their current status, and
          recommended actions.
        </p>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="border p-4 rounded-md text-center">
            <div className="text-2xl font-bold">32</div>
            <div className="text-sm text-gray-600">Total Issues</div>
          </div>
          <div className="border p-4 rounded-md text-center">
            <div className="text-2xl font-bold text-green-600">21</div>
            <div className="text-sm text-gray-600">Resolved</div>
          </div>
          <div className="border p-4 rounded-md text-center">
            <div className="text-2xl font-bold text-yellow-600">11</div>
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
            <tr>
              <td className="border p-2">Safety</td>
              <td className="border p-2">12</td>
              <td className="border p-2">4</td>
              <td className="border p-2">8</td>
            </tr>
            <tr>
              <td className="border p-2">Compliance</td>
              <td className="border p-2">8</td>
              <td className="border p-2">3</td>
              <td className="border p-2">5</td>
            </tr>
            <tr>
              <td className="border p-2">Operational</td>
              <td className="border p-2">6</td>
              <td className="border p-2">2</td>
              <td className="border p-2">4</td>
            </tr>
            <tr>
              <td className="border p-2">Environmental</td>
              <td className="border p-2">4</td>
              <td className="border p-2">1</td>
              <td className="border p-2">3</td>
            </tr>
            <tr>
              <td className="border p-2">Quality</td>
              <td className="border p-2">2</td>
              <td className="border p-2">1</td>
              <td className="border p-2">1</td>
            </tr>
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
            <tr>
              <td className="border p-2">Fire exit blocked in warehouse</td>
              <td className="border p-2">Safety</td>
              <td className="border p-2 text-red-600">High</td>
              <td className="border p-2">Apr 30, 2023</td>
              <td className="border p-2">John Smith</td>
            </tr>
            <tr>
              <td className="border p-2">Missing encryption for data at rest</td>
              <td className="border p-2">Compliance</td>
              <td className="border p-2 text-red-600">High</td>
              <td className="border p-2">May 1, 2023</td>
              <td className="border p-2">Lisa Chen</td>
            </tr>
            <tr>
              <td className="border p-2">Chemical spill containment inadequate</td>
              <td className="border p-2">Environmental</td>
              <td className="border p-2 text-red-600">High</td>
              <td className="border p-2">May 5, 2023</td>
              <td className="border p-2">Robert Johnson</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Resolution Trends</h2>
        <p>
          Average time to resolution: <strong>8.5 days</strong>
        </p>
        <p>
          Resolution rate: <strong>65.6%</strong>
        </p>
        <p>
          Improvement from previous period: <strong className="text-green-600">+12%</strong>
        </p>
      </div>

      <div className="text-xs text-gray-500 mt-8 pt-4 border-t">
        <p>Confidential: For internal use only</p>
        <p>© {currentDate.getFullYear()} Audit Management System</p>
      </div>
    </div>
  )
}
