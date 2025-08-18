import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function AnalyticsLoadingSkeleton() {
  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-3 w-32" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent className="flex items-center justify-center py-8">
            <div className="relative">
              <Skeleton className="w-48 h-48 rounded-full" />
              {/* Legend items */}
              <div className="absolute -right-20 top-4 space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Skeleton className="w-3 h-3 rounded" />
                    <Skeleton
                      className={`h-3 ${
                        i === 0 ? "w-16" : i === 1 ? "w-20" : "w-24"
                      }`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-44" />
          </CardHeader>
          <CardContent className="py-8">
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <Skeleton
                    className={`h-3 ${
                      i === 0
                        ? "w-20"
                        : i === 1
                        ? "w-16"
                        : i === 2
                        ? "w-12"
                        : "w-24"
                    }`}
                  />
                  <div className="flex-1 ml-4">
                    <Skeleton
                      className={`h-6 ${
                        i === 0
                          ? "w-3/4"
                          : i === 1
                          ? "w-1/2"
                          : i === 2
                          ? "w-1/3"
                          : "w-5/6"
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
