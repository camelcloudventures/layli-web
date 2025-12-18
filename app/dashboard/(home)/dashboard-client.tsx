"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Users,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Loader2,
} from "lucide-react";

import { useInspections } from "@/hooks/use-inspections";
import { useIssues } from "@/hooks/use-issues";
import { useActions } from "@/hooks/use-actions";
import { useSites } from "@/hooks/use-sites";
import { useUsers } from "@/hooks/use-users";
import TopBar from "./components/top-bar";
import { SiteSelector } from "./components/site-selector";
import {
  DateRangePicker,
  type DateRange,
} from "./components/date-range-picker";
import { ComplianceScoreWidget } from "./components/compliance-score-widget";
import { IssuesWidget } from "./components/issues-widget";
import { ActionsWidget } from "./components/actions-widget";
import { FlaggedItemsWidget } from "./components/flagged-items-widget";
import { InspectionsBySiteChart } from "./components/inspections-by-site-chart";
import { FlaggedItemsBySiteChart } from "./components/flagged-items-by-site-chart";
import { OverdueInspectionsBySiteChart } from "./components/overdue-inspections-by-site-chart";
import { InspectionsByTemplateChart } from "./components/inspections-by-template-chart";
import { OverdueInspectionsList } from "./components/overdue-inspections-list";
import { FlaggedItemsPanel } from "./components/flagged-items-panel";
import {
  getInspectionsBySite,
  getFlaggedItemsBySite,
  getOverdueInspectionsBySite,
  getOverdueInspectionsList,
  getInspectionsByTemplate,
  getComplianceScore,
  getActiveUsersCount,
  type InspectionsBySite,
  type FlaggedItemsBySite,
  type InspectionsByTemplate,
  type ComplianceScoreData,
} from "@/app/dashboard/analytics/actions/actions";
import type { Inspection } from "@/lib/types/inspection-types";
import { subDays, format } from "date-fns";

export const dynamic = "force-dynamic";

// Mock user data
const mockUser = {
  fullName: "Demo User",
  email: "demo@example.com",
  role: "admin",
  image: "",
};

export function DashboardClient() {
  // Selected filters (what user is choosing)
  const [selectedSite, setSelectedSite] = useState<string | null>(null);
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange>({
    type: "last-week",
  });

  // Applied filters (what triggers API calls)
  const [appliedSite, setAppliedSite] = useState<string | null>(null);
  const [appliedDateRange, setAppliedDateRange] = useState<DateRange>({
    type: "last-week",
  });

  const [flaggedPanelOpen, setFlaggedPanelOpen] = useState(false);

  // Data hooks
  const { sites } = useSites();
  const { users } = useUsers();
  const { inspections } = useInspections();
  const { issues, isLoading: issuesLoading } = useIssues();
  const { actions, isLoading: actionsLoading } = useActions();

  // Analytics data state
  const [inspectionsBySite, setInspectionsBySite] = useState<
    InspectionsBySite[] | null
  >(null);
  const [flaggedItemsBySite, setFlaggedItemsBySite] = useState<
    FlaggedItemsBySite[] | null
  >(null);
  const [overdueInspectionsBySite, setOverdueInspectionsBySite] =
    useState<Array<{
      site_id: string;
      site_name: string;
      count: number;
    }> | null>(null);
  const [overdueInspectionsList, setOverdueInspectionsList] = useState<
    Inspection[] | null
  >(null);
  const [inspectionsByTemplate, setInspectionsByTemplate] = useState<
    InspectionsByTemplate[] | null
  >(null);
  const [complianceScore, setComplianceScore] =
    useState<ComplianceScoreData | null>(null);
  const [activeUsersCount, setActiveUsersCount] = useState<number | null>(null);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false);

  const sitesData = useMemo(() => sites?.data || [], [sites?.data]);
  const isSingleSite = sitesData.length === 1;
  const isAllSitesView = appliedSite === null;

  // Auto-select single site on initial load
  useEffect(() => {
    if (
      isSingleSite &&
      sitesData[0] &&
      selectedSite !== String(sitesData[0].id)
    ) {
      const siteId = String(sitesData[0].id);
      setSelectedSite(siteId);
      setAppliedSite(siteId); // Auto-apply on initial load
    }
  }, [isSingleSite, sitesData, selectedSite]);

  // Calculate date range from applied filters
  const dateRangeParams = useMemo(() => {
    const now = new Date();
    let startDate: Date;
    let endDate: Date = now;

    if (appliedDateRange.type === "last-week") {
      startDate = subDays(now, 7);
    } else if (appliedDateRange.type === "last-month") {
      startDate = subDays(now, 30);
    } else {
      startDate = appliedDateRange.startDate || subDays(now, 7);
      endDate = appliedDateRange.endDate || now;
    }

    return {
      startDate: format(startDate, "yyyy-MM-dd"),
      endDate: format(endDate, "yyyy-MM-dd"),
    };
  }, [appliedDateRange]);

  // Handle Filter button click
  const handleApplyFilters = () => {
    setAppliedSite(selectedSite);
    setAppliedDateRange(selectedDateRange);
  };

  // Fetch analytics data
  // NOTE: API calls are triggered when applied filters change (via Filter button click or initial load)
  useEffect(() => {
    const fetchAnalytics = async () => {
      setIsLoadingAnalytics(true);
      try {
        const { startDate, endDate } = dateRangeParams;

        console.log("Fetching analytics with applied filters:", {
          appliedSite,
          startDate,
          endDate,
          isAllSitesView,
        });

        if (isAllSitesView) {
          // All Sites view - fetch aggregated data
          // Clear site-specific data first
          setOverdueInspectionsList(null);
          setInspectionsByTemplate(null);

          const [
            inspectionsBySiteData,
            flaggedBySiteData,
            overdueBySiteData,
            complianceData,
            usersCount,
          ] = await Promise.all([
            getInspectionsBySite(startDate, endDate),
            getFlaggedItemsBySite(startDate, endDate),
            getOverdueInspectionsBySite(startDate, endDate),
            getComplianceScore(null, startDate, endDate),
            getActiveUsersCount(),
          ]);

          setInspectionsBySite(inspectionsBySiteData);
          setFlaggedItemsBySite(flaggedBySiteData);
          setOverdueInspectionsBySite(overdueBySiteData);
          setComplianceScore(complianceData);
          setActiveUsersCount(usersCount);
        } else {
          // Site Level view - fetch site-specific data
          // Clear "All Sites" data first
          setInspectionsBySite(null);
          setFlaggedItemsBySite(null);
          setOverdueInspectionsBySite(null);

          if (!appliedSite) {
            console.warn("No site selected for site-level view");
            setIsLoadingAnalytics(false);
            return;
          }

          const [overdueListData, templateData, complianceData] =
            await Promise.all([
              getOverdueInspectionsList(appliedSite),
              getInspectionsByTemplate(appliedSite, startDate, endDate),
              getComplianceScore(appliedSite, startDate, endDate),
            ]);

          setOverdueInspectionsList(overdueListData);
          setInspectionsByTemplate(templateData);
          setComplianceScore(complianceData);
        }
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setIsLoadingAnalytics(false);
      }
    };

    fetchAnalytics();
  }, [appliedSite, dateRangeParams, isAllSitesView]);

  // Filter data by applied site and date range
  const filteredInspections = useMemo(() => {
    let filtered = inspections || [];

    if (appliedSite) {
      filtered = filtered.filter((inspection) => {
        // Handle both number and string types for site_id
        const inspectionSiteId = inspection.site_id;
        if (inspectionSiteId === null || inspectionSiteId === undefined)
          return false;
        return String(inspectionSiteId) === appliedSite;
      });
    }

    const { startDate, endDate } = dateRangeParams;
    filtered = filtered.filter((inspection) => {
      const inspectionDate = new Date(inspection.created_at);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return inspectionDate >= start && inspectionDate <= end;
    });

    return filtered;
  }, [inspections, appliedSite, dateRangeParams]);

  const filteredIssues = useMemo(() => {
    let filtered = issues || [];

    if (appliedSite) {
      filtered = filtered.filter((issue) => {
        // Handle both number and string types for site_id
        const issueSiteId = issue.site_id;
        if (issueSiteId === null || issueSiteId === undefined) return false;
        return String(issueSiteId) === appliedSite;
      });
    }

    const { startDate, endDate } = dateRangeParams;
    filtered = filtered.filter((issue) => {
      const issueDate = new Date(issue.created_at);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return issueDate >= start && issueDate <= end;
    });

    return filtered;
  }, [issues, appliedSite, dateRangeParams]);

  const filteredActions = useMemo(() => {
    let filtered = actions || [];

    if (appliedSite) {
      filtered = filtered.filter((action) => {
        // Handle both number and string types for site_id
        const actionSiteId = action.site_id;
        if (actionSiteId === null || actionSiteId === undefined) return false;
        return String(actionSiteId) === appliedSite;
      });
    }

    return filtered;
  }, [actions, appliedSite]);

  // Calculate metrics
  const completedInspections = filteredInspections.filter(
    (inspection) => inspection.status === "completed"
  ).length;

  const openActions = filteredActions.filter(
    (action) => action.status === "todo" || action.status === "in_progress"
  ).length;

  const totalActions = filteredActions.length;

  // Calculate issues count and delta (simplified - would need previous period data)
  const issuesCount = filteredIssues.length;
  const issuesDelta = undefined; // Would need to fetch previous period data

  // Calculate flagged and failed counts
  const flaggedCount =
    flaggedItemsBySite?.reduce((sum, item) => sum + item.flagged_count, 0) || 0;
  const failedCount =
    flaggedItemsBySite?.reduce((sum, item) => sum + item.failed_count, 0) || 0;

  const totalSites = sitesData.length;
  const totalUsers = activeUsersCount || users?.length || 0;

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* @ts-expect-error - mockUser is not typed */}
      <TopBar user={mockUser} />

      {/* Filters */}
      <div className="flex items-center gap-4">
        {!isSingleSite && (
          <SiteSelector value={selectedSite} onChange={setSelectedSite} />
        )}
        <DateRangePicker
          value={selectedDateRange}
          onChange={setSelectedDateRange}
        />
        <Button
          onClick={handleApplyFilters}
          disabled={isLoadingAnalytics}
          className="ml-auto"
        >
          {isLoadingAnalytics ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </>
          ) : (
            "Filter"
          )}
        </Button>
      </div>

      {/* All Sites View */}
      {isAllSitesView && (
        <div className="space-y-6">
          {/* KPI Widgets */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Users
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{totalUsers}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Active users
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Sites
                </CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{totalSites}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Sites you can access
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Completed Inspections
                </CardTitle>
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{completedInspections}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  In date range
                </p>
              </CardContent>
            </Card>

            <ComplianceScoreWidget
              data={complianceScore}
              isLoading={isLoadingAnalytics}
            />
            <IssuesWidget
              count={issuesCount}
              delta={issuesDelta}
              isLoading={issuesLoading}
            />
            <ActionsWidget
              openCount={openActions}
              totalCount={totalActions}
              isLoading={actionsLoading}
            />
          </div>

          {/* Charts */}
          <div className="grid gap-6 md:grid-cols-2">
            <InspectionsBySiteChart
              data={inspectionsBySite}
              isLoading={isLoadingAnalytics}
            />
            <FlaggedItemsBySiteChart
              data={flaggedItemsBySite}
              isLoading={isLoadingAnalytics}
              onOpenPanel={() => setFlaggedPanelOpen(true)}
            />
            <OverdueInspectionsBySiteChart
              data={overdueInspectionsBySite}
              isLoading={isLoadingAnalytics}
            />
          </div>
        </div>
      )}

      {/* Site Level View */}
      {!isAllSitesView && appliedSite && (
        <div className="space-y-6">
          {/* KPI Row */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Completed Inspections
                </CardTitle>
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{completedInspections}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  In date range
                </p>
              </CardContent>
            </Card>

            <ComplianceScoreWidget
              data={complianceScore}
              isLoading={isLoadingAnalytics}
            />

            <ActionsWidget
              openCount={openActions}
              totalCount={totalActions}
              isLoading={actionsLoading}
            />

            <IssuesWidget
              count={issuesCount}
              delta={issuesDelta}
              isLoading={issuesLoading}
            />

            <FlaggedItemsWidget
              flaggedCount={flaggedCount}
              failedCount={failedCount}
              onOpenPanel={() => setFlaggedPanelOpen(true)}
              isLoading={isLoadingAnalytics}
            />

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Overdue Inspections
                </CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {overdueInspectionsList?.length || 0}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Past due date
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts and Lists */}
          <div className="grid gap-6 md:grid-cols-2">
            <InspectionsByTemplateChart
              data={inspectionsByTemplate}
              isLoading={isLoadingAnalytics}
            />
            <Card>
              <CardHeader>
                <CardTitle>Recent Issues</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {filteredIssues.slice(0, 5).map((issue) => (
                    <div key={issue.id} className="p-3 border rounded-lg">
                      <div className="font-medium">{issue.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {issue.category} • {issue.priority}
                      </div>
                    </div>
                  ))}
                  {filteredIssues.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No issues found
                    </div>
                  )}
                </div>
                {filteredIssues.length > 5 && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-4"
                    asChild
                  >
                    <Link href="/dashboard/issues">View all issues</Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6">
            <OverdueInspectionsList
              data={overdueInspectionsList}
              isLoading={isLoadingAnalytics}
            />

            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {filteredActions.slice(0, 5).map((action) => (
                    <div key={action.id} className="p-3 border rounded-lg">
                      <div className="font-medium">{action.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {action.status} • {action.priority}
                      </div>
                    </div>
                  ))}
                  {filteredActions.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No actions found
                    </div>
                  )}
                </div>
                {filteredActions.length > 5 && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-4"
                    asChild
                  >
                    <Link href="/dashboard/actions">View all actions</Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Flagged Items Panel */}
      <FlaggedItemsPanel
        open={flaggedPanelOpen}
        onOpenChange={setFlaggedPanelOpen}
        siteId={appliedSite}
        dateRange={appliedDateRange}
      />
    </div>
  );
}
