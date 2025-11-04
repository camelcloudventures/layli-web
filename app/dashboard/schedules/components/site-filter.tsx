"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SiteOption } from "../types/schedule-form-types";

interface SiteFilterProps {
  sites: SiteOption[] | { data?: SiteOption[] };
  value: string;
  onChange: (value: string) => void;
}

export function SiteFilter({ sites, value, onChange }: SiteFilterProps) {
  // Handle sites.data structure if needed
  const sitesList = Array.isArray(sites) ? sites : sites?.data || [];

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select site">
          {value === "all"
            ? "All sites"
            : sitesList.find((s) => String(s.id) === value)?.name || "All sites"}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All sites</SelectItem>
        {sitesList.map((site) => (
          <SelectItem key={site.id} value={String(site.id)}>
            {site.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

