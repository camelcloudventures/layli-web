import { Skeleton } from "@/components/ui/skeleton";

export function InspectionCardSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-3 p-4 border rounded-lg bg-card"
        >
          <Skeleton className="h-5 w-5 rounded-full flex-shrink-0" />

          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-48" />

            <div className="flex items-center gap-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-1 rounded-full" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>

          <Skeleton className="h-6 w-16 rounded-full flex-shrink-0" />
        </div>
      ))}
    </div>
  );
}
