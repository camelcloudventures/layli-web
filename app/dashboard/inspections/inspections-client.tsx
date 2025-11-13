"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useInspections } from "@/hooks/use-inspections";
import { InspectionList } from "./components/inspection-list";

export default function InspectionsClient() {
  const { inspections, isLoading } = useInspections();

  console.log("inspections length ", inspections.length);
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Inspections</h1>

      <Card>
        <CardContent className="pt-6">
          <InspectionList
            //@ts-expect-error -e9
            inspections={inspections || []}
            loading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
}
