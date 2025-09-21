"use client";

import { useAnalyticsComprehensive } from "@/hooks/use-analytics-comprehensive";
import ComplianceStatus from "../widgets/compliance-status";
import RiskAssessment from "../widgets/risk-assessment";
import InspectionEfficiency from "../widgets/inspection-efficiency";
import EmptyState from "../empty-state";

interface InspectionsTabProps {
  isLoading: boolean;
}

export default function InspectionsTab({ isLoading }: InspectionsTabProps) {
  const { comprehensiveData, complianceData, riskData } =
    useAnalyticsComprehensive();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ComplianceStatus isLoading={true} />
        <RiskAssessment isLoading={true} />
        <InspectionEfficiency isLoading={true} />
      </div>
    );
  }

  if (!comprehensiveData && !complianceData && !riskData) {
    return <EmptyState type="inspections" />;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <ComplianceStatus data={complianceData || undefined} />
      <RiskAssessment data={riskData || undefined} />
      <InspectionEfficiency
        data={{
          inspections_per_inspector: 18, // Default value from screenshots
        }}
      />
    </div>
  );
}
