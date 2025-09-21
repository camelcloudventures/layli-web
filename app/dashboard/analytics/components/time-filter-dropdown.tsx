"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TimeFilter } from "@/app/dashboard/analytics/actions/actions";

interface TimeFilterDropdownProps {
  value: TimeFilter;
  onChange: (value: TimeFilter) => void;
}

export default function TimeFilterDropdown({
  value,
  onChange,
}: TimeFilterDropdownProps) {
  const timeFilterOptions = [
    { value: "month", label: "Last Month" },
    { value: "6months", label: "Last 6 Months" },
    { value: "year", label: "Last Year" },
  ];

  const getDisplayValue = (filter: TimeFilter) => {
    const option = timeFilterOptions.find((opt) => opt.value === filter);
    return option?.label || "Last Month";
  };

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select time period">
          {getDisplayValue(value)}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {timeFilterOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
