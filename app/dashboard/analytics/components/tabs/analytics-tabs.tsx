"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { useAnalyticsComprehensive } from "@/hooks/use-analytics-comprehensive";
import InspectionsTab from "./inspections-tab";
import ActionsTab from "./actions-tab";
import IssuesTab from "./issues-tab";
import LocationsTab from "./locations-tab";

interface AnalyticsTabsProps {
  currentTab: "inspections" | "issues" | "actions" | "locations";
  onTabChange: (
    tab: "inspections" | "issues" | "actions" | "locations"
  ) => void;
  isLoading: boolean;
}

export default function AnalyticsTabs({
  currentTab,
  onTabChange,
  isLoading,
}: AnalyticsTabsProps) {
  return (
    <Tabs
      value={currentTab}
      onValueChange={(value) =>
        onTabChange(value as "inspections" | "issues" | "actions" | "locations")
      }
      className="w-full"
    >
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="inspections">Inspections</TabsTrigger>
        <TabsTrigger value="issues">Issues</TabsTrigger>
        <TabsTrigger value="actions">Actions</TabsTrigger>
        <TabsTrigger value="locations">Locations</TabsTrigger>
      </TabsList>

      <TabsContent value="inspections" className="mt-6">
        <InspectionsTab isLoading={isLoading} />
      </TabsContent>

      <TabsContent value="issues" className="mt-6">
        <IssuesTab isLoading={isLoading} />
      </TabsContent>

      <TabsContent value="actions" className="mt-6">
        <ActionsTab isLoading={isLoading} />
      </TabsContent>

      <TabsContent value="locations" className="mt-6">
        <LocationsTab isLoading={isLoading} />
      </TabsContent>
    </Tabs>
  );
}
