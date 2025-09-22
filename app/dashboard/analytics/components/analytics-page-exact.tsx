"use client";

import { useAnalyticsComprehensive } from "@/hooks/use-analytics-comprehensive";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react";

export default function AnalyticsPageExact() {
  const {
    summaryMetrics,
    currentTab,
    timeFilter,

    changeTab,
    changeTimeFilter,
  } = useAnalyticsComprehensive();

  // Mock data to match the screenshots exactly
  const mockData = {
    summaryMetrics: {
      totalInspections: 112,
      averageScore: 83,
      openIssues: 24,
      actionCompletionRate: 78,
    },
    trendIndicators: [
      { label: "Inspections", value: 18, color: "green" },
      { label: "Score", value: 5, color: "green" },
      { label: "Issues", value: -12, color: "green" },
      { label: "Completion", value: 8, color: "green" },
    ],
    inspectionTrends: [
      { month: "Jan", completed: 15, passed: 12, failed: 3 },
      { month: "Feb", completed: 18, passed: 15, failed: 3 },
      { month: "Mar", completed: 22, passed: 18, failed: 4 },
      { month: "Apr", completed: 25, passed: 20, failed: 5 },
      { month: "May", completed: 20, passed: 16, failed: 4 },
      { month: "Jun", completed: 12, passed: 10, failed: 2 },
    ],
    passFailData: [
      { name: "Passed", value: 89, color: "#10b981" },
      { name: "Failed", value: 23, color: "#ef4444" },
    ],
    complianceData: [
      { name: "Compliant", value: 80, color: "#10b981" },
      { name: "Non-compliant", value: 20, color: "#ef4444" },
    ],
    riskData: [
      { name: "High Risk", value: 12, color: "#ef4444" },
      { name: "Medium Risk", value: 28, color: "#f59e0b" },
      { name: "Low Risk", value: 60, color: "#10b981" },
    ],
    locationData: [
      { name: "Main Factory", inspections: 24, score: 85 },
      { name: "Warehouse A", inspections: 18, score: 78 },
      { name: "Office Building", inspections: 12, score: 82 },
      { name: "Distribution Center", inspections: 30, score: 88 },
      { name: "Research Lab", inspections: 15, score: 90 },
    ],
    issuesByCategory: [
      { name: "Safety", value: 35, color: "#ef4444" },
      { name: "Environmental", value: 25, color: "#f59e0b" },
      { name: "Compliance", value: 20, color: "#3b82f6" },
      { name: "Operational", value: 20, color: "#8b5cf6" },
    ],
    topRecurringIssues: [
      { issue: "Missing guardrails", category: "Safety", count: 12 },
      { issue: "Improper waste disposal", category: "Environmental", count: 9 },
      { issue: "Expired certifications", category: "Compliance", count: 8 },
      {
        issue: "Equipment maintenance overdue",
        category: "Operational",
        count: 7,
      },
      { issue: "Inadequate lighting", category: "Safety", count: 6 },
    ],
  };

  const data = summaryMetrics ? { ...mockData, summaryMetrics } : mockData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-1">
            View audit analytics and insights
          </p>
        </div>
        <Select value={timeFilter} onValueChange={changeTimeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="month">Last Month</SelectItem>
            <SelectItem value="6months">Last 6 Months</SelectItem>
            <SelectItem value="year">Last Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <span className="text-sm font-medium text-gray-600">
                Total Inspections
              </span>
              <span className="text-3xl font-bold text-gray-900">
                {data.summaryMetrics.totalInspections}
              </span>
              <span className="text-xs text-gray-500">Last 6 months</span>
              <div className="flex items-center mt-2 text-green-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">
                  +{data.trendIndicators[0].value}% from previous period
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <span className="text-sm font-medium text-gray-600">
                Average Score
              </span>
              <span className="text-3xl font-bold text-gray-900">
                {data.summaryMetrics.averageScore}%
              </span>
              <span className="text-xs text-gray-500">
                Across all inspections
              </span>
              <div className="flex items-center mt-2 text-green-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">
                  +{data.trendIndicators[1].value}% from previous period
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <span className="text-sm font-medium text-gray-600">
                Open Issues
              </span>
              <span className="text-3xl font-bold text-gray-900">
                {data.summaryMetrics.openIssues}
              </span>
              <span className="text-xs text-gray-500">Requiring attention</span>
              <div className="flex items-center mt-2 text-red-600">
                <TrendingDown className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">
                  {data.trendIndicators[2].value}% from previous period
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <span className="text-sm font-medium text-gray-600">
                Action Completion
              </span>
              <span className="text-3xl font-bold text-gray-900">
                {data.summaryMetrics.actionCompletionRate}%
              </span>
              <span className="text-xs text-gray-500">
                On-time completion rate
              </span>
              <div className="flex items-center mt-2 text-green-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">
                  +{data.trendIndicators[3].value}% from previous period
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs
        value={currentTab}
        onValueChange={(value) =>
          changeTab(value as "inspections" | "issues" | "actions" | "locations")
        }
        className="w-full"
      >
        <TabsList className="grid p-1 grid-cols-4">
          <TabsTrigger value="inspections">Inspections</TabsTrigger>
          <TabsTrigger value="issues">Issues</TabsTrigger>
          <TabsTrigger value="actions">Actions</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
        </TabsList>

        <TabsContent value="inspections" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Inspection Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Inspection Trends</CardTitle>
                <p className="text-sm text-gray-600">
                  Number of inspections over time
                </p>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart
                    data={data.inspectionTrends}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#6b7280" }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#6b7280" }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="completed"
                      stackId="1"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="passed"
                      stackId="2"
                      stroke="#10b981"
                      fill="#10b981"
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="failed"
                      stackId="3"
                      stroke="#ef4444"
                      fill="#ef4444"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Pass/Fail Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Pass/Fail Distribution</CardTitle>
                <p className="text-sm text-gray-600">
                  Inspection outcomes by category
                </p>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={data.passFailData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={60}>
                      {data.passFailData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Compliance Status */}
            <Card>
              <CardHeader>
                <CardTitle>Compliance Status</CardTitle>
                <p className="text-sm text-gray-600">
                  Overall compliance metrics
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={data.complianceData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        dataKey="value"
                      >
                        {data.complianceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="text-center mt-4">
                  <span className="text-2xl font-bold text-gray-900">80%</span>
                  <p className="text-sm text-gray-600">Compliant</p>
                </div>
              </CardContent>
            </Card>

            {/* Risk Assessment */}
            <Card>
              <CardHeader>
                <CardTitle>Risk Assessment</CardTitle>
                <p className="text-sm text-gray-600">Current risk levels</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.riskData.map((risk, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{risk.name}</span>
                        <span className="font-bold">{risk.value}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full"
                          style={{
                            width: `${risk.value}%`,
                            backgroundColor: risk.color,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Inspection Efficiency */}
            <Card>
              <CardHeader>
                <CardTitle>Inspection Efficiency</CardTitle>
                <p className="text-sm text-gray-600">
                  Time and resource metrics
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      42 min
                    </div>
                    <p className="text-sm text-gray-600">
                      Average Time per Inspection
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">18</div>
                    <p className="text-sm text-gray-600">
                      Inspections per Inspector
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="issues" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Issues by Category */}
            <Card>
              <CardHeader>
                <CardTitle>Issues by Category</CardTitle>
                <p className="text-sm text-gray-600">
                  Distribution of issues by type
                </p>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={data.issuesByCategory}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {data.issuesByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Top Recurring Issues */}
            <Card>
              <CardHeader>
                <CardTitle>Top Recurring Issues</CardTitle>
                <p className="text-sm text-gray-600">
                  Most frequently identified problems
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.topRecurringIssues.map((issue, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-gray-900">
                          {issue.issue}
                        </p>
                        <p className="text-sm text-gray-600">
                          ({issue.category})
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold text-gray-900">
                          {issue.count}
                        </span>
                        <p className="text-xs text-gray-500">occurrences</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="actions" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Action Completion Rate */}
            <Card>
              <CardHeader>
                <CardTitle>Action Completion Rate</CardTitle>
                <p className="text-sm text-gray-600">
                  Completion rate over time
                </p>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart
                    data={data.inspectionTrends}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#6b7280" }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#6b7280" }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="completed"
                      stroke="#10b981"
                      fill="#10b981"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Action Status */}
            <Card>
              <CardHeader>
                <CardTitle>Action Status</CardTitle>
                <p className="text-sm text-gray-600">
                  Current action status distribution
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">Completed</span>
                    </div>
                    <span className="text-lg font-bold text-gray-900">78%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm font-medium">In Progress</span>
                    </div>
                    <span className="text-lg font-bold text-gray-900">15%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <span className="text-sm font-medium">Overdue</span>
                    </div>
                    <span className="text-lg font-bold text-gray-900">7%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="locations" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Location Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Location Performance</CardTitle>
                <p className="text-sm text-gray-600">
                  Average inspection scores by location
                </p>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={data.locationData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#6b7280" }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#6b7280" }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      }}
                    />
                    <Bar
                      dataKey="score"
                      fill="#3b82f6"
                      radius={[4, 4, 0, 0]}
                      maxBarSize={60}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Inspection Coverage */}
            <Card>
              <CardHeader>
                <CardTitle>Inspection Coverage</CardTitle>
                <p className="text-sm text-gray-600">
                  Inspection frequency by location
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.locationData.map((location, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{location.name}</span>
                        <span className="font-bold">
                          {location.inspections} inspections
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-blue-600"
                          style={{
                            width: `${(location.inspections / 30) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
