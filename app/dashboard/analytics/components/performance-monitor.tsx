"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Clock, Database, Wifi } from "lucide-react";

interface PerformanceMetrics {
  loadTime: number;
  apiCalls: number;
  cacheHitRate: number;
  memoryUsage: number;
}

export default function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    loadTime: 0,
    apiCalls: 0,
    cacheHitRate: 0,
    memoryUsage: 0,
  });

  useEffect(() => {
    // Simulate performance monitoring
    const interval = setInterval(() => {
      setMetrics({
        loadTime: Math.random() * 2000 + 500, // 500-2500ms
        apiCalls: Math.floor(Math.random() * 10) + 1,
        cacheHitRate: Math.random() * 40 + 60, // 60-100%
        memoryUsage: Math.random() * 50 + 20, // 20-70%
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getPerformanceStatus = (value: number, type: string) => {
    if (type === "loadTime") {
      if (value < 1000) return { status: "excellent", color: "green" };
      if (value < 2000) return { status: "good", color: "yellow" };
      return { status: "slow", color: "red" };
    }
    if (type === "cacheHitRate") {
      if (value > 90) return { status: "excellent", color: "green" };
      if (value > 70) return { status: "good", color: "yellow" };
      return { status: "poor", color: "red" };
    }
    return { status: "normal", color: "blue" };
  };

  const performanceData = [
    {
      icon: Clock,
      title: "Load Time",
      value: `${metrics.loadTime.toFixed(0)}ms`,
      status: getPerformanceStatus(metrics.loadTime, "loadTime"),
    },
    {
      icon: Activity,
      title: "API Calls",
      value: metrics.apiCalls.toString(),
      status: { status: "normal", color: "blue" },
    },
    {
      icon: Database,
      title: "Cache Hit Rate",
      value: `${metrics.cacheHitRate.toFixed(1)}%`,
      status: getPerformanceStatus(metrics.cacheHitRate, "cacheHitRate"),
    },
    {
      icon: Wifi,
      title: "Memory Usage",
      value: `${metrics.memoryUsage.toFixed(1)}%`,
      status: { status: "normal", color: "blue" },
    },
  ];

  return (
    <Card className="border-dashed">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-gray-600">
          Performance Monitor
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {performanceData.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Icon className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">
                    {item.title}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">
                    {item.value}
                  </span>
                  <Badge
                    variant="secondary"
                    className={`text-xs ${
                      item.status.color === "green"
                        ? "bg-green-100 text-green-800"
                        : item.status.color === "yellow"
                        ? "bg-yellow-100 text-yellow-800"
                        : item.status.color === "red"
                        ? "bg-red-100 text-red-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {item.status.status}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
