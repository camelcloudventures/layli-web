import { Skeleton } from "@/components/ui/skeleton";

export default function ActionsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      <div>
        <Skeleton className="h-10 w-[200px] mb-6" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, colIndex) => (
            <div
              key={colIndex}
              className="bg-muted/50 rounded-lg p-4 min-h-[500px]"
            >
              <Skeleton className="h-6 w-24 mb-4" />

              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, rowIndex) => (
                  <Skeleton key={rowIndex} className="h-32 w-full rounded-md" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
