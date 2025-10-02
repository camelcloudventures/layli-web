"use server";

import { GET } from "@/app/backend/apiMethods";

// Legacy interfaces (keeping for backward compatibility)
export interface AnalyticsSummary {
  total_inspections: number;
  total_sites: number;
  average_score: number;
  failed_inspections: number;
  passed_inspections: number;
}

export interface IssuesAnalytics {
  issuesByCategory: Record<string, number>;
  topRecurringIssues: Array<{
    title: string;
    occurrences: number;
  }>;
}

export interface ActionsAnalytics {
  byStatus: {
    pending: number;
    in_progress: number;
    done: number;
  };
  byPriority: {
    high: number;
    medium: number;
    low: number;
  };
  completionRate: number;
  overdueActions: number;
  totalActions: number;
}

export interface SchedulesAnalytics {
  byFrequency: Record<string, number>;
}

export interface InspectionsAnalytics {
  byStatus: Record<string, number>;
  byResult: Record<string, number>;
}

// New comprehensive analytics types based on API responses
export interface ComprehensiveAnalytics {
  summary: {
    total_inspections: number;
    average_score: number;
    open_issues: number;
    action_completion_rate: number;
    trends: {
      inspections_change: number;
      score_change: number;
      issues_change: number;
      completion_change: number;
    };
  };
  location_performance: Array<{
    location_name: string;
    average_score: number;
  }>;
  inspection_coverage: Array<{
    location_name: string;
    inspection_count: number;
  }>;
  compliance_status: {
    overall_percentage: number;
    compliant_areas: number;
    non_compliant_areas: number;
  };
  risk_assessment: {
    high_risk_percentage: number;
    medium_risk_percentage: number;
    low_risk_percentage: number;
  };
}

export interface LocationAnalytics {
  location_performance: Array<{
    location_name: string;
    average_score: number;
  }>;
  inspection_coverage: Array<{
    location_name: string;
    inspection_count: number;
  }>;
}

export interface RiskAnalytics {
  high_risk_percentage: number;
  medium_risk_percentage: number;
  low_risk_percentage: number;
}

export interface ComplianceAnalytics {
  overall_percentage: number;
  compliant_areas: number;
  non_compliant_areas: number;
}

export interface IssuesAnalyticsNew {
  issuesByCategory: Record<string, number>;
  topRecurringIssues: Array<{
    title: string;
    occurrences: number;
    category: string;
  }>;
}

// Time filter type
export type TimeFilter = "month" | "6months" | "year";

export async function getAnalyticsSummary(): Promise<AnalyticsSummary | null> {
  try {
    const response = (await GET("/analytics/summary")) as {
      success: string;
      data: AnalyticsSummary;
    };
    if (response.success) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error("Error fetching analytics summary:", error);
    return null;
  }
}

export async function getIssuesAnalytics(): Promise<IssuesAnalytics | null> {
  try {
    const response = (await GET("/analytics/issues")) as {
      success: string;
      data: IssuesAnalytics;
    };
    if (response.success) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error("Error fetching issues analytics:", error);
    return null;
  }
}

export async function getActionsAnalytics(): Promise<ActionsAnalytics | null> {
  try {
    const response = (await GET("/analytics/actions")) as {
      success: string;
      data: ActionsAnalytics;
    };
    if (response.success) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error("Error fetching actions analytics:", error);
    return null;
  }
}

export async function getSchedulesAnalytics(): Promise<SchedulesAnalytics | null> {
  try {
    const response = (await GET("/analytics/schedules")) as {
      success: string;
      data: SchedulesAnalytics;
    };
    if (response.success) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error("Error fetching schedules analytics:", error);
    return null;
  }
}

export async function getInspectionsAnalytics(): Promise<InspectionsAnalytics | null> {
  try {
    const response = (await GET("/analytics/inspections")) as {
      success: string;
      data: InspectionsAnalytics;
    };
    if (response.success) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error("Error fetching inspections analytics:", error);
    return null;
  }
}

// New comprehensive analytics functions
export async function getComprehensiveAnalytics(
  timeFilter: TimeFilter = "month"
): Promise<ComprehensiveAnalytics | null> {
  try {
    const response = (await GET(
      `/analytics/comprehensive?timeFilter=${timeFilter}`
    )) as {
      success: string;
      data: ComprehensiveAnalytics;
    };

    console.log("Comprehensive analytics response:", response);
    if (response.success) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error("Error fetching comprehensive analytics:", error);
    return null;
  }
}

export async function getLocationAnalytics(
  timeFilter: TimeFilter = "month"
): Promise<LocationAnalytics | null> {
  try {
    const response = (await GET(
      `/analytics/locations?timeFilter=${timeFilter}`
    )) as {
      success: string;
      data: LocationAnalytics;
    };
    if (response.success) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error("Error fetching location analytics:", error);
    return null;
  }
}

export async function getRiskAnalytics(
  timeFilter: TimeFilter = "month"
): Promise<RiskAnalytics | null> {
  try {
    const response = (await GET(
      `/analytics/risk?timeFilter=${timeFilter}`
    )) as {
      success: string;
      data: RiskAnalytics;
    };
    if (response.success) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error("Error fetching risk analytics:", error);
    return null;
  }
}

export async function getComplianceAnalytics(
  timeFilter: TimeFilter = "month"
): Promise<ComplianceAnalytics | null> {
  try {
    const response = (await GET(
      `/analytics/compliance?timeFilter=${timeFilter}`
    )) as {
      success: string;
      data: ComplianceAnalytics;
    };
    if (response.success) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error("Error fetching compliance analytics:", error);
    return null;
  }
}

export async function getIssuesAnalyticsNew(): Promise<IssuesAnalyticsNew | null> {
  try {
    const response = (await GET("/analytics/issues")) as {
      success: string;
      data: IssuesAnalyticsNew;
    };
    if (response.success) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error("Error fetching issues analytics:", error);
    return null;
  }
}
