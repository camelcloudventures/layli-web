"use client";

import { DataTable } from "@/components/custom/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Permission } from "@/lib/auth/auth";
import type { Inspection } from "@/lib/types/inspection-types";
import { Plus, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import HasPermission from "../../components/has-permission";
import { columns } from "./columns";
import Loading from "./loading";

interface InspectionListProps {
  inspections: Inspection[];
  loading?: boolean;
}

export function InspectionList({
  inspections = [],
  loading = false,
}: InspectionListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Ensure inspections is an array
  const inspectionsArray = Array.isArray(inspections) ? inspections : [];

  const filteredInspections = inspectionsArray.filter((inspection) => {
    return (
      inspection.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inspection.site?.name || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (inspection.prepared_by || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div>
      <div className="flex items-center justify-end space-x-2 mb-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search inspections..."
            className="w-[250px] pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <HasPermission permission={Permission.CREATE_INSPECTION}>
          <Button asChild>
            <Link href="/dashboard/inspections/create">
              <Plus className="mr-2 h-4 w-4" />
              Create Inspection
            </Link>
          </Button>
        </HasPermission>
      </div>

      {loading ? (
        <Loading />
      ) : (
        <div>
          <DataTable
            columns={columns}
            data={filteredInspections}
            className="[&_table]:border-collapse [&_th]:!border-b-gray-200 [&_th]:!text-gray-600 [&_th]:!font-medium [&_td]:!py-4 [&_tr]:!border-b [&_tr]:border-gray-100 [&_tr:last-child]:!border-0 [&_tr:first-child]:!border-t-0 [&_tr]:!border-x-0"
          />
        </div>
      )}
    </div>
  );
}
