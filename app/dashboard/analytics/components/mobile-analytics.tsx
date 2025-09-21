"use client";

import { useAnalyticsComprehensive } from "@/hooks/use-analytics-comprehensive";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import SummaryMetrics from "./summary-metrics";
import TrendIndicators from "./trend-indicators";
import AnalyticsTabs from "./tabs/analytics-tabs";

export default function MobileAnalytics() {
  const { currentTab, changeTab, isLoading } = useAnalyticsComprehensive();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="space-y-4">
      {/* Mobile Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-sm text-gray-600">Quick overview</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center space-x-2"
        >
          <span>{isExpanded ? "Collapse" : "Expand"}</span>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Mobile Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">112</div>
            <div className="text-xs text-gray-500">Inspections</div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">83%</div>
            <div className="text-xs text-gray-500">Avg Score</div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">24</div>
            <div className="text-xs text-gray-500">Open Issues</div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">78%</div>
            <div className="text-xs text-gray-500">Completion</div>
          </div>
        </Card>
      </div>

      {/* Expandable Content */}
      {isExpanded && (
        <div className="space-y-6">
          {/* Full Summary Metrics */}
          <SummaryMetrics />

          {/* Trend Indicators */}
          <TrendIndicators
            trends={[
              { label: "Inspections", value: 18, color: "green" },
              { label: "Score", value: 5, color: "green" },
              { label: "Issues", value: -12, color: "green" },
              { label: "Completion", value: 8, color: "green" },
            ]}
          />

          {/* Mobile Tabs */}
          <div className="space-y-4">
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
              {["Inspections", "Issues", "Actions", "Locations"].map((tab) => (
                <Button
                  key={tab}
                  variant={
                    currentTab === tab.toLowerCase() ? "default" : "ghost"
                  }
                  size="sm"
                  //eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onClick={() => changeTab(tab.toLowerCase() as any)}
                  className="flex-1 text-xs"
                >
                  {tab}
                </Button>
              ))}
            </div>

            <AnalyticsTabs
              currentTab={currentTab}
              onTabChange={changeTab}
              isLoading={isLoading}
            />
          </div>
        </div>
      )}
    </div>
  );
}
