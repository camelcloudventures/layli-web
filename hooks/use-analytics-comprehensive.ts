import { useEffect, useCallback } from "react";
import { useAnalyticsStore } from "@/store/analytics-new";
import {
  getComprehensiveAnalytics,
  getLocationAnalytics,
  getRiskAnalytics,
  getComplianceAnalytics,
  getIssuesAnalyticsNew,
  TimeFilter,
} from "@/app/dashboard/analytics/actions/actions";

export function useAnalyticsComprehensive() {
  const {
    comprehensiveData,
    locationData,
    riskData,
    complianceData,
    issuesData,
    currentTab,
    timeFilter,
    isLoading,
    error,
    lastUpdated,
    setComprehensiveData,
    setLocationData,
    setRiskData,
    setComplianceData,
    setIssuesData,
    setCurrentTab,
    setTimeFilter,
    setLoading,
    setError,
    setLastUpdated,
    clearData,
  } = useAnalyticsStore();

  // Fetch comprehensive data
  const fetchComprehensiveData = useCallback(
    async (filter: TimeFilter = timeFilter) => {
      try {
        setLoading(true);
        setError(null);

        const [comprehensive, locations, risk, compliance, issues] =
          await Promise.all([
            getComprehensiveAnalytics(filter),
            getLocationAnalytics(filter),
            getRiskAnalytics(filter),
            getComplianceAnalytics(filter),
            getIssuesAnalyticsNew(),
          ]);

        if (comprehensive) setComprehensiveData(comprehensive);
        if (locations) setLocationData(locations);
        if (risk) setRiskData(risk);
        if (compliance) setComplianceData(compliance);
        if (issues) setIssuesData(issues);

        setLastUpdated(new Date());
      } catch (err) {
        console.error("Error fetching analytics data:", err);
        setError("Failed to fetch analytics data");
      } finally {
        setLoading(false);
      }
    },
    [
      timeFilter,
      setComprehensiveData,
      setLocationData,
      setRiskData,
      setComplianceData,
      setIssuesData,
      setLoading,
      setError,
      setLastUpdated,
    ]
  );

  // Auto-refresh function
  const refreshData = useCallback(() => {
    fetchComprehensiveData(timeFilter);
  }, [fetchComprehensiveData, timeFilter]);

  // Change time filter
  const changeTimeFilter = useCallback(
    (filter: TimeFilter) => {
      setTimeFilter(filter);
      fetchComprehensiveData(filter);
    },
    [setTimeFilter, fetchComprehensiveData]
  );

  // Change tab
  const changeTab = useCallback(
    (tab: "inspections" | "issues" | "actions" | "locations") => {
      setCurrentTab(tab);
    },
    [setCurrentTab]
  );

  // Initial data fetch
  useEffect(() => {
    if (!comprehensiveData && !isLoading) {
      fetchComprehensiveData();
    }
  }, [comprehensiveData, isLoading, fetchComprehensiveData]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isLoading) {
        refreshData();
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [refreshData, isLoading]);

  // Get trend indicators data
  const getTrendIndicators = () => {
    if (!comprehensiveData?.summary?.trends) return [];

    const { trends } = comprehensiveData.summary;
    return [
      {
        label: "Inspections",
        value: trends.inspections_change,
        color: (trends.inspections_change >= 0 ? "green" : "red") as
          | "green"
          | "red",
      },
      {
        label: "Score",
        value: trends.score_change,
        color: (trends.score_change >= 0 ? "green" : "red") as "green" | "red",
      },
      {
        label: "Issues",
        value: trends.issues_change,
        color: (trends.issues_change >= 0 ? "red" : "green") as "green" | "red", // Negative is good for issues
      },
      {
        label: "Completion",
        value: trends.completion_change,
        color: (trends.completion_change >= 0 ? "green" : "red") as
          | "green"
          | "red",
      },
    ];
  };

  // Get summary metrics
  const getSummaryMetrics = () => {
    if (!comprehensiveData?.summary) return null;

    const { summary } = comprehensiveData;
    return {
      totalInspections: summary.total_inspections,
      averageScore: summary.average_score,
      openIssues: summary.open_issues,
      actionCompletionRate: summary.action_completion_rate,
    };
  };

  // Get tab-specific data
  const getTabData = () => {
    switch (currentTab) {
      case "inspections":
        return {
          trends: comprehensiveData?.summary?.trends,
          summary: getSummaryMetrics(),
        };
      case "issues":
        return {
          issuesByCategory: issuesData?.issuesByCategory,
          topRecurringIssues: issuesData?.topRecurringIssues,
        };
      case "actions":
        return {
          summary: getSummaryMetrics(),
          trends: comprehensiveData?.summary?.trends,
        };
      case "locations":
        return {
          locationPerformance: locationData?.location_performance,
          inspectionCoverage: locationData?.inspection_coverage,
        };
      default:
        return null;
    }
  };

  return {
    // Data
    comprehensiveData,
    locationData,
    riskData,
    complianceData,
    issuesData,

    // UI State
    currentTab,
    timeFilter,
    isLoading,
    error,
    lastUpdated,

    // Computed data
    trendIndicators: getTrendIndicators(),
    summaryMetrics: getSummaryMetrics(),
    tabData: getTabData(),

    // Actions
    refreshData,
    changeTimeFilter,
    changeTab,
    clearData,
  };
}
