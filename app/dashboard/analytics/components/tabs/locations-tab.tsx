"use client";

import { useAnalyticsComprehensive } from "@/hooks/use-analytics-comprehensive";
import LocationPerformance from "../widgets/location-performance";
import InspectionCoverage from "../widgets/inspection-coverage";
import ComplianceStatus from "../widgets/compliance-status";
import RiskAssessment from "../widgets/risk-assessment";
import InspectionEfficiency from "../widgets/inspection-efficiency";
import EmptyState from "../empty-state";

interface LocationsTabProps {
  isLoading: boolean;
}

export default function LocationsTab({ isLoading }: LocationsTabProps) {
  const { locationData, complianceData, riskData } =
    useAnalyticsComprehensive();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LocationPerformance isLoading={true} />
          <InspectionCoverage isLoading={true} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ComplianceStatus isLoading={true} />
          <RiskAssessment isLoading={true} />
          <InspectionEfficiency isLoading={true} />
        </div>
      </div>
    );
  }

  if (!locationData && !complianceData && !riskData) {
    return <EmptyState type="locations" />;
  }

  return (
    <div className="space-y-6">
      {/* Location-specific widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LocationPerformance data={locationData?.location_performance} />
        <InspectionCoverage data={locationData?.inspection_coverage} />
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
