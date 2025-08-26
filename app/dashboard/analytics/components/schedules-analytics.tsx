"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { type SchedulesAnalytics } from "../actions/actions";

interface SchedulesAnalyticsProps {
  data: SchedulesAnalytics;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export default function SchedulesAnalytics({ data }: SchedulesAnalyticsProps) {
  // Prepare data for frequency chart
  const frequencyData = Object.entries(data.byFrequency).map(
    ([frequency, count]) => ({
      name: frequency.charAt(0).toUpperCase() + frequency.slice(1),
      value: count,
    })
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-primary">Schedules by Frequency</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={frequencyData}
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
                {frequencyData.map((entry, index) => (
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
      </CardContent>
    </Card>
  );
}
