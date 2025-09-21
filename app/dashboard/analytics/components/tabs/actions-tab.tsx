"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAnalyticsComprehensive } from "@/hooks/use-analytics-comprehensive";
import ComplianceStatus from "../widgets/compliance-status";
import RiskAssessment from "../widgets/risk-assessment";
import InspectionEfficiency from "../widgets/inspection-efficiency";
import EmptyState from "../empty-state";

interface ActionsTabProps {
  isLoading: boolean;
}

export default function ActionsTab({ isLoading }: ActionsTabProps) {
  const { comprehensiveData, complianceData, riskData } =
    useAnalyticsComprehensive();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-primary">
              Action Completion Rate
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Percentage of actions completed on time
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-primary">Action Status</CardTitle>
            <p className="text-sm text-muted-foreground">
              Current status of all actions
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          </CardContent>
        </Card>
        <ComplianceStatus isLoading={true} />
        <RiskAssessment isLoading={true} />
        <InspectionEfficiency isLoading={true} />
      </div>
    );
  }

  if (!comprehensiveData && !complianceData && !riskData) {
    return <EmptyState type="actions" />;
  }

  // Mock action status data based on screenshots
  const actionStatusData = {
    pending: 42,
    inProgress: 28,
    completed: 86,
  };

  return (
    <div className="space-y-6">
      {/* Action-specific widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-primary">
              Action Completion Rate
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Percentage of actions completed on time
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-center justify-center">
              <p className="text-sm text-gray-500">
                No completion rate data available
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-primary">Action Status</CardTitle>
            <p className="text-sm text-muted-foreground">
              Current status of all actions
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    Pending
                  </span>
                </div>
                <span className="text-lg font-bold text-gray-900">
                  {actionStatusData.pending}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <div className="w-4 h-4 bg-yellow-600 rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    In Progress
                  </span>
                </div>
                <span className="text-lg font-bold text-gray-900">
                  {actionStatusData.inProgress}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <div className="w-4 h-4 bg-green-600 rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    Completed
                  </span>
                </div>
                <span className="text-lg font-bold text-gray-900">
                  {actionStatusData.completed}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Shared widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ComplianceStatus data={complianceData || undefined} />
        <RiskAssessment data={riskData || undefined} />
        <InspectionEfficiency
          data={{
            inspections_per_inspector: 18, // Default value from screenshots
          }}
        />
      </div>
    </div>
  );
}
