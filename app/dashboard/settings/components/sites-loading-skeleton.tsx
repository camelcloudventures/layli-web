import { Skeleton } from "@/components/ui/skeleton";

export function SitesLoadingSkeleton() {
  return (
    <div className="flex flex-col">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="grid grid-cols-7 gap-4 p-4 items-center">
          <Skeleton className="h-6 w-20 rounded-full" />

          <Skeleton className="h-6 w-16 rounded-full" />

          <Skeleton className="h-4 w-24" />

          <Skeleton className="h-4 w-32" />

          <Skeleton className="h-6 w-6 rounded" />
        </div>
      ))}
    </div>
  );
}
