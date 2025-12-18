"use client";

import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { FlaggedItemCard } from "@/components/custom/flagged-item-card";
import {
  getFlaggedItems,
  type FlaggedItem,
} from "@/app/dashboard/analytics/actions/actions";
import type { DateRange } from "./date-range-picker";
import { subDays, format } from "date-fns";

interface FlaggedItemsPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  siteId?: string | null;
  dateRange?: DateRange;
}

export function FlaggedItemsPanel({
  open,
  onOpenChange,
  siteId,
  dateRange,
}: FlaggedItemsPanelProps) {
  // Use dashboard date range if provided, otherwise default to last-week
  const [data, setData] = useState<FlaggedItem[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open) {
      fetchFlaggedItems();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, siteId, dateRange]);

  const fetchFlaggedItems = async () => {
    setIsLoading(true);
    try {
      const now = new Date();
      let startDate: Date;
      let endDate: Date = now;

      // Use dashboard date range if provided, otherwise use panel's own filter
      if (dateRange) {
        if (dateRange.type === "last-week") {
          startDate = subDays(now, 7);
        } else if (dateRange.type === "last-month") {
          startDate = subDays(now, 30);
        } else {
          startDate = dateRange.startDate || subDays(now, 7);
          endDate = dateRange.endDate || now;
        }
      } else {
        // Fallback to panel's own date filter
        startDate = subDays(now, 30);
      }

      console.log("FlaggedItemsPanel: Fetching flagged items", {
        siteId,
        startDate: format(startDate, "yyyy-MM-dd"),
        endDate: format(endDate, "yyyy-MM-dd"),
      });

      // Fetch all items (no pagination)
      const result = await getFlaggedItems(
        siteId || undefined,
        format(startDate, "yyyy-MM-dd"),
        format(endDate, "yyyy-MM-dd")
      );

      if (result) {
        setData(result);
      }
    } catch (error) {
      console.error("Error fetching flagged items:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:w-[800px] md:w-[900px]">
        <SheetHeader>
          <SheetTitle>Flagged Items</SheetTitle>
          <SheetDescription>
            View and manage flagged inspection items
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4">
          {/* Results Count */}
          {data && (
            <div className="text-sm p-4 text-muted-foreground">
              {data.length} flagged item{data.length !== 1 ? "s" : ""}
            </div>
          )}

          {/* Flagged Items List */}
          <div className="space-y-3 max-h-[calc(100vh-250px)] p-4 overflow-y-auto">
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-32 bg-gray-100 rounded animate-pulse"
                  />
                ))}
              </div>
            ) : data && data.length > 0 ? (
              data.map((item) => (
                <FlaggedItemCard
                  key={item.id}
                  item={item}
                  compact={false}
                  showInspectionLink={true}
                />
              ))
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                No flagged items found
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
