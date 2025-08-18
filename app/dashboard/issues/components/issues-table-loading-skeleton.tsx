import { Skeleton } from "@/components/ui/skeleton";

export function IssuesTableLoadingSkeleton() {
  return (
    <div className="w-full">
      <div className="rounded-md border">
        <div className="grid grid-cols-6 gap-4 p-4 border-b bg-muted/50">
          <div className="font-medium text-sm text-muted-foreground">Title</div>
          <div className="font-medium text-sm text-muted-foreground">
            Category
          </div>
          <div className="font-medium text-sm text-muted-foreground">
            Priority
          </div>
          <div className="font-medium text-sm text-muted-foreground">
            Status
          </div>
          <div className="font-medium text-sm text-muted-foreground">
            Created At
          </div>
          <div className="font-medium text-sm text-muted-foreground">
            Actions
          </div>
        </div>

        {Array.from({ length: 7 }).map((_, index) => (
          <div
            key={index}
            className="grid grid-cols-6 gap-4 p-4 border-b last:border-b-0"
          >
            {/* Title */}
            <div className="flex items-center">
              <Skeleton className="h-4 w-16" />
            </div>

            {/* Category */}
            <div className="flex items-center">
              <Skeleton className="h-6 w-14 rounded-full" />
            </div>

            {/* Priority */}
            <div className="flex items-center">
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>

            {/* Status */}
            <div className="flex items-center">
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>

            {/* Created At */}
            <div className="flex items-center">
              <Skeleton className="h-4 w-20" />
            </div>

            {/* Actions */}
            <div className="flex items-center">
              <Skeleton className="h-6 w-6 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
