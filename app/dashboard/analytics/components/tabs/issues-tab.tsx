"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useAnalyticsComprehensive } from "@/hooks/use-analytics-comprehensive";
import EmptyState from "../empty-state";

interface IssuesTabProps {
  isLoading: boolean;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export default function IssuesTab({ isLoading }: IssuesTabProps) {
  const { issuesData } = useAnalyticsComprehensive();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-primary">Issues by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-primary">Top Recurring Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!issuesData) {
    return <EmptyState type="issues" />;
  }

  // Prepare data for category chart
  const categoryData = Object.entries(issuesData.issuesByCategory || {}).map(
    ([category, count]) => ({
      name: category.charAt(0).toUpperCase() + category.slice(1),
      value: count,
    })
  );

  // Prepare data for recurring issues chart
  const recurringData = (issuesData.topRecurringIssues || []).map((issue) => ({
    name:
      issue.title.length > 30
        ? issue.title.substring(0, 30) + "..."
        : issue.title,
    occurrences: issue.occurrences,
    category: issue.category,
  }));

  if (categoryData.length === 0 && recurringData.length === 0) {
    return <EmptyState type="issues" />;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Issues by Category */}
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">Issues by Category</CardTitle>
          <p className="text-sm text-muted-foreground">
            Distribution of issues by type
          </p>
        </CardHeader>
        <CardContent>
          {categoryData.length > 0 ? (
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name}: ${(percent! * 100).toFixed(0)}%`
                    }
                  >
                    {categoryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[300px] flex items-center justify-center">
              <p className="text-sm text-gray-500">
                No category data available
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Top Recurring Issues */}
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">Top Recurring Issues</CardTitle>
          <p className="text-sm text-muted-foreground">
            Most frequently identified problems
          </p>
        </CardHeader>
        <CardContent>
          {recurringData.length > 0 ? (
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={recurringData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" width={120} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="occurrences" fill="#0088FE" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[300px] flex items-center justify-center">
              <p className="text-sm text-gray-500">
                No recurring issues data available
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
