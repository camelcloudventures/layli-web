import { format } from "date-fns";

interface ComplianceReportData {
  overview: {
    overall_score: number;
    total_frameworks: number;
    compliant_frameworks: number;
    partial_frameworks: number;
    non_compliant_frameworks: number;
  };
  frameworks: Array<{
    name: string;
    score: number;
    status: string;
    last_audit: string;
    total_inspections: number;
    passed_inspections: number;
    failed_inspections: number;
  }>;
  issues: Array<{
    id: string;
    title: string;
    framework: string;
    severity: string;
    due_date: string;
    status: string;
    created_at: string;
  }>;
  recommendations: Array<{
    priority: string;
    category: string;
    description: string;
    framework: string;
    estimated_effort: string;
  }>;
  generated_at: string;
  period: string;
}

interface ComplianceReportProps {
  data?: ComplianceReportData;
}

export function ComplianceReport({ data }: ComplianceReportProps) {
  // Use real data or fallback to mock data if not available
  const reportData = data || {
    overview: {
      overall_score: 87,
      total_frameworks: 5,
      compliant_frameworks: 4,
      partial_frameworks: 1,
      non_compliant_frameworks: 0,
    },
    frameworks: [
      {
        name: "ISO 27001",
        score: 92,
        status: "Compliant",
        last_audit: "2024-01-15",
        total_inspections: 12,
        passed_inspections: 11,
        failed_inspections: 1,
      },
      {
        name: "GDPR",
        score: 88,
        status: "Compliant",
        last_audit: "2024-01-10",
        total_inspections: 8,
        passed_inspections: 7,
        failed_inspections: 1,
      },
      {
        name: "SOC 2",
        score: 85,
        status: "Compliant",
        last_audit: "2024-01-08",
        total_inspections: 6,
        passed_inspections: 5,
        failed_inspections: 1,
      },
      {
        name: "PCI DSS",
        score: 78,
        status: "Partial",
        last_audit: "2024-01-05",
        total_inspections: 10,
        passed_inspections: 7,
        failed_inspections: 3,
      },
      {
        name: "HIPAA",
        score: 95,
        status: "Compliant",
        last_audit: "2024-01-12",
        total_inspections: 4,
        passed_inspections: 4,
        failed_inspections: 0,
      },
    ],
    issues: [
      {
        id: "issue-001",
        title: "Incomplete access control documentation",
        framework: "General",
        severity: "Medium",
        due_date: "2024-02-15",
        status: "Open",
        created_at: "2024-01-15",
      },
      {
        id: "issue-002",
        title: "Missing encryption for data at rest",
        framework: "General",
        severity: "High",
        due_date: "2024-02-01",
        status: "Open",
        created_at: "2024-01-10",
      },
    ],
    recommendations: [
      {
        priority: "High",
        category: "Actions",
        description: "Complete 2 overdue actions",
        framework: "General",
        estimated_effort: "1-2 weeks",
      },
      {
        priority: "High",
        category: "Issues",
        description: "Resolve 1 high-severity issues",
        framework: "General",
        estimated_effort: "2-4 weeks",
      },
    ],
    generated_at: new Date().toISOString(),
    period: "month",
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "compliant":
        return "text-green-600";
      case "partial":
        return "text-yellow-600";
      case "non-compliant":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "high":
        return "text-red-600";
      case "medium":
        return "text-yellow-600";
      case "low":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "text-red-600";
      case "medium":
        return "text-yellow-600";
      case "low":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div
      id="compliance-report"
      className="p-8 bg-white text-black"
      style={{ width: "800px" }}
    >
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">Compliance Status Report</h1>
        <p className="text-gray-500">
          Generated on{" "}
          {format(new Date(reportData.generated_at), "MMMM d, yyyy")}
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
              style={{ width: `${reportData.overview.overall_score}%` }}
            ></div>
          </div>
          <span className="text-lg font-bold">
            {reportData.overview.overall_score}%
          </span>
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
            {reportData.frameworks.map((framework, index) => (
              <tr key={index}>
                <td className="border p-2">{framework.name}</td>
                <td className="border p-2">{framework.score}%</td>
                <td
                  className={`border p-2 ${getStatusColor(framework.status)}`}
                >
                  {framework.status}
                </td>
                <td className="border p-2">
                  {format(new Date(framework.last_audit), "MMM d, yyyy")}
                </td>
              </tr>
            ))}
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
            {reportData.issues.map((issue, index) => (
              <tr key={index}>
                <td className="border p-2">{issue.title}</td>
                <td className="border p-2">{issue.framework}</td>
                <td
                  className={`border p-2 ${getSeverityColor(issue.severity)}`}
                >
                  {issue.severity}
                </td>
                <td className="border p-2">
                  {format(new Date(issue.due_date), "MMM d, yyyy")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Recommendations</h2>
        <div className="space-y-3">
          {reportData.recommendations.map((rec, index) => (
            <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{rec.description}</p>
                  <p className="text-sm text-gray-600">
                    {rec.category} • {rec.framework}
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`text-sm font-medium ${getPriorityColor(
                      rec.priority
                    )}`}
                  >
                    {rec.priority}
                  </span>
                  <p className="text-xs text-gray-500">
                    {rec.estimated_effort}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 pt-4 border-t">
        <p className="text-sm text-gray-500 text-center">
          Report generated on{" "}
          {format(
            new Date(reportData.generated_at),
            "MMMM d, yyyy 'at' h:mm a"
          )}
          for the {reportData.period} period
        </p>
      </div>
    </div>
  );
}
