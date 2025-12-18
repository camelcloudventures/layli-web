"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export type DateRangeType = "last-week" | "last-month" | "custom";

export interface DateRange {
  type: DateRangeType;
  startDate?: Date;
  endDate?: Date;
}

interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
}

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  const [customStartOpen, setCustomStartOpen] = useState(false);
  const [customEndOpen, setCustomEndOpen] = useState(false);

  const handlePresetChange = (preset: "last-week" | "last-month") => {
    onChange({ type: preset });
  };

  const handleCustomDateChange = (
    date: Date | undefined,
    type: "start" | "end"
  ) => {
    if (type === "start") {
      onChange({
        type: "custom",
        startDate: date,
        endDate: value.endDate,
      });
      setCustomStartOpen(false);
    } else {
      onChange({
        type: "custom",
        startDate: value.startDate,
        endDate: date,
      });
      setCustomEndOpen(false);
    }
  };

  const getDisplayValue = () => {
    if (value.type === "last-week") return "Last week";
    if (value.type === "last-month") return "Last month";
    if (value.type === "custom") {
      if (value.startDate && value.endDate) {
        return `${format(value.startDate, "MMM d")} - ${format(value.endDate, "MMM d")}`;
      }
      if (value.startDate) {
        return `From ${format(value.startDate, "MMM d")}`;
      }
      return "Custom range";
    }
    return "Last week";
  };

  return (
    <div className="flex items-center gap-2">
      <Select
        value={value.type}
        onValueChange={(val) => {
          if (val === "custom") {
            onChange({ type: "custom" });
          } else {
            handlePresetChange(val as "last-week" | "last-month");
          }
        }}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue>{getDisplayValue()}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="last-week">Last week</SelectItem>
          <SelectItem value="last-month">Last month</SelectItem>
          <SelectItem value="custom">Custom range</SelectItem>
        </SelectContent>
      </Select>

      {value.type === "custom" && (
        <div className="flex items-center gap-2">
          <Popover open={customStartOpen} onOpenChange={setCustomStartOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[140px] justify-start text-left font-normal",
                  !value.startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {value.startDate ? (
                  format(value.startDate, "MMM d")
                ) : (
                  <span>Start date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={value.startDate}
                onSelect={(date) => handleCustomDateChange(date, "start")}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Popover open={customEndOpen} onOpenChange={setCustomEndOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[140px] justify-start text-left font-normal",
                  !value.endDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {value.endDate ? (
                  format(value.endDate, "MMM d")
                ) : (
                  <span>End date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={value.endDate}
                onSelect={(date) => handleCustomDateChange(date, "end")}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      )}
    </div>
  );
}

