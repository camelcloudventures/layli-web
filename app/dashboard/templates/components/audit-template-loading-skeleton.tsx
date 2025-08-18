import { Skeleton } from "@/components/ui/skeleton";

export function AuditTemplatesSkeleton() {
  return (
    <div className="space-y-6">
      <div className="relative">
        <Skeleton className="h-10 w-full rounded-md" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="border rounded-lg p-4 space-y-4 bg-white">
            <div className="flex justify-center items-center h-32 bg-gray-50 rounded-md">
              <Skeleton className="h-12 w-12 rounded-full" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>

            <div className="flex gap-4 text-sm">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
            </div>

            <div className="flex justify-between items-center pt-2 border-t">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-16 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
