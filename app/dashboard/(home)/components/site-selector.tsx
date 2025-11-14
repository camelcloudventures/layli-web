"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSites } from "@/hooks/use-sites";

interface SiteSelectorProps {
  value: string | null;
  onChange: (value: string | null) => void;
}

export function SiteSelector({ value, onChange }: SiteSelectorProps) {
  const { sites } = useSites();
  const sitesData = sites?.data || [];

  // If only one site, auto-select it and hide selector
  if (sitesData.length === 1) {
    if (value !== String(sitesData[0].id)) {
      onChange(String(sitesData[0].id));
    }
    return null;
  }

  return (
    <Select
      value={value || "all"}
      onValueChange={(val) => onChange(val === "all" ? null : val)}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select site">
          {value === null || value === "all"
            ? "All sites"
            : sitesData.find((s) => String(s.id) === value)?.name || "All sites"}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All sites</SelectItem>
        {sitesData.map((site) => (
          <SelectItem key={site.id} value={String(site.id)}>
            {site.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

