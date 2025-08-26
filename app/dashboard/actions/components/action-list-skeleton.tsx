import { Skeleton } from "@/components/ui/skeleton";

export function ActionListSkeleton() {
  return (
    <div className="flex flex-col">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="grid grid-cols-7 gap-4 p-4 items-center">
          {/* Status Badge */}
          <Skeleton className="h-6 w-20 rounded-full" />

          {/* Priority Badge */}
          <Skeleton className="h-6 w-16 rounded-full" />

          {/* Due Date */}
          <Skeleton className="h-4 w-24" />

          {/* Assignee */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-4 w-3" />
          </div>

          {/* Site */}
          <Skeleton className="h-4 w-32" />

          {/* Actions */}
          <Skeleton className="h-6 w-6 rounded" />
        </div>
      ))}
    </div>
  );
}
