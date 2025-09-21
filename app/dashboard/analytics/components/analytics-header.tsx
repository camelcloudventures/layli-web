"use client";

import { useAnalyticsComprehensive } from "@/hooks/use-analytics-comprehensive";
import TimeFilterDropdown from "./time-filter-dropdown";
import { RefreshCw, Download, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function AnalyticsHeader() {
  const { timeFilter, isLoading, lastUpdated, changeTimeFilter, refreshData } =
    useAnalyticsComprehensive();

  const formatLastUpdated = (date: Date | null) => {
    if (!date) return "Never updated";
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="flex flex-col space-y-4">
      {/* Main Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600">View audit analytics and insights</p>
        </div>
        <div className="flex items-center space-x-3">
          <TimeFilterDropdown value={timeFilter} onChange={changeTimeFilter} />
          <Button
            variant="outline"
            size="sm"
            onClick={refreshData}
            disabled={isLoading}
            className="flex items-center space-x-2"
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
            <span>Refresh</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center space-x-2"
          >
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </Button>
        </div>
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between py-2 px-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div
              className={`w-2 h-2 rounded-full ${
                isLoading ? "bg-yellow-500" : "bg-green-500"
              }`}
            />
            <span className="text-sm text-gray-600">
              {isLoading ? "Loading..." : "Data loaded"}
            </span>
          </div>
          {lastUpdated && (
            <Badge variant="secondary" className="text-xs">
              Last updated: {formatLastUpdated(lastUpdated)}
            </Badge>
          )}
        </div>
        <div className="text-sm text-gray-500">
          Auto-refresh every 5 minutes
        </div>
      </div>
    </div>
  );
}
