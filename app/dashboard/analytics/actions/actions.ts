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

// Dashboard analytics interfaces
export interface FlaggedItem {
  id: string;
  question_id: number;
  question_text: string;
  question_field_type?: string;
  response_value?: string;
  text_value?: string | null;
  numeric_value?: number | null;
  flag_reason?: string;
  inspector_notes?: string;
  points_earned: number;
  points_possible: number;
  created_at: string;
  inspection_id: string;
  inspection_title: string;
  template_name: string;
  site_name?: string;
  section_name?: string;
  inspector_name?: string;
}

export interface FlaggedItemsResponse {
  items: FlaggedItem[];
  total: number;
  page: number;
  pageSize: number;
}

// For backward compatibility - but we'll use FlaggedItem[] directly

export interface InspectionsBySite {
  site_id: string;
  site_name: string;
  count: number;
}

export interface FlaggedItemsBySite {
  site_id: string;
  site_name: string;
  flagged_count: number;
  failed_count: number;
}

export interface OverdueInspection {
  id: string;
  title: string;
  assignee_name?: string;
  due_date: string;
  days_overdue: number;
}

export interface InspectionsByTemplate {
  template_id: string;
  template_name: string;
  count: number;
}

export interface ComplianceScoreData {
  score: number;
  sparkline: Array<{
    date: string;
    score: number;
  }>;
}

// Time filter type
export type TimeFilter = "month" | "6months" | "year";

export async function getAnalyticsSummary(): Promise<AnalyticsSummary | null> {
  try {
    const response = (await GET("/analytics/summary")) as {
      success: boolean;
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
      success: boolean;
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
      success: boolean;
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
      success: boolean;
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
      success: boolean;
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
      success: boolean;
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
      success: boolean;
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
      success: boolean;
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
      success: boolean;
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
      success: boolean;
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

// Dashboard analytics functions
export async function getFlaggedItems(
  siteId?: string | null,
  startDate?: string,
  endDate?: string
): Promise<FlaggedItem[] | null> {
  console.log(
    "Getting flagged items for siteId:",
    siteId,
    "startDate:",
    startDate,
    "endDate:",
    endDate
  );
  try {
    const params = new URLSearchParams();
    if (siteId) params.append("siteId", siteId);
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    const response = (await GET(
      `/analytics/flagged-items?${params.toString()}`
    )) as {
      success: boolean;
      data: FlaggedItemsResponse | FlaggedItem[];
    };

    console.log("Flagged items response:", response);
    if (response.success) {
      // Handle both response formats (with pagination wrapper or direct array)
      if (Array.isArray(response.data)) {
        return response.data;
      }
      // If it's the old format with pagination, just return items
      if (
        response.data &&
        typeof response.data === "object" &&
        "items" in response.data
      ) {
        return (response.data as FlaggedItemsResponse).items;
      }
    }
    return null;
  } catch (error) {
    console.error("Error fetching flagged items:", error);
    return null;
  }
}

export async function getInspectionsBySite(
  startDate?: string,
  endDate?: string
): Promise<InspectionsBySite[] | null> {
  try {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    const response = (await GET(
      `/analytics/inspections-by-site?${params.toString()}`
    )) as {
      success: boolean;
      data: InspectionsBySite[];
    };
    if (response.success) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error("Error fetching inspections by site:", error);
    return null;
  }
}

export async function getFlaggedItemsBySite(
  startDate?: string,
  endDate?: string
): Promise<FlaggedItemsBySite[] | null> {
  try {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    const response = (await GET(
      `/analytics/flagged-items-by-site?${params.toString()}`
    )) as {
      success: boolean;
      data: FlaggedItemsBySite[];
    };
    if (response.success) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error("Error fetching flagged items by site:", error);
    return null;
  }
}

export async function getOverdueInspectionsBySite(
  startDate?: string,
  endDate?: string
): Promise<Array<{
  site_id: string;
  site_name: string;
  count: number;
}> | null> {
  try {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    const response = (await GET(
      `/analytics/overdue-inspections-by-site?${params.toString()}`
    )) as {
      success: boolean;
      data: Array<{ site_id: string; site_name: string; count: number }>;
    };
    if (response.success) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error("Error fetching overdue inspections by site:", error);
    return null;
  }
}

export async function getOverdueInspectionsList(
  siteId?: string | null
): Promise<import("@/lib/types/inspection-types").Inspection[] | null> {
  try {
    const params = new URLSearchParams();
    if (siteId) params.append("siteId", siteId);

    const response = (await GET(
      `/analytics/overdue-inspections?${params.toString()}`
    )) as {
      success: boolean;
      data: import("@/lib/types/inspection-types").Inspection[];
    };
    if (response.success) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error("Error fetching overdue inspections list:", error);
    return null;
  }
}

export async function getInspectionsByTemplate(
  siteId: string,
  startDate?: string,
  endDate?: string
): Promise<InspectionsByTemplate[] | null> {
  try {
    const params = new URLSearchParams({ siteId });
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    const response = (await GET(
      `/analytics/inspections-by-template?${params.toString()}`
    )) as {
      success: boolean;
      data: InspectionsByTemplate[];
    };
    if (response.success) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error("Error fetching inspections by template:", error);
    return null;
  }
}

export async function getComplianceScore(
  siteId?: string | null,
  startDate?: string,
  endDate?: string
): Promise<ComplianceScoreData | null> {
  try {
    const params = new URLSearchParams();
    if (siteId) params.append("siteId", siteId);
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    const response = (await GET(
      `/analytics/compliance-score?${params.toString()}`
    )) as {
      success: boolean;
      data: ComplianceScoreData;
    };
    if (response.success) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error("Error fetching compliance score:", error);
    return null;
  }
}

export async function getActiveUsersCount(): Promise<number | null> {
  try {
    const response = (await GET("/analytics/active-users-count")) as {
      success: boolean;
      data: { count: number };
    };
    if (response.success) {
      return response.data.count;
    }
    return null;
  } catch (error) {
    console.error("Error fetching active users count:", error);
    return null;
  }
}
