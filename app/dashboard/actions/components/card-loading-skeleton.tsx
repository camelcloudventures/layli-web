import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function CardLoadingSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {[...Array(4)].map((_, i) => (
        <Card
          key={i}
          className="cursor-pointer hover:border-primary/50 transition-colors"
        >
          <CardContent className="p-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Skeleton className="h-4 w-4 rounded" />

                  <Skeleton className="h-3 w-12" />
                  <Skeleton className="h-4 w-16 rounded-full" />
                </div>
                <Skeleton className="h-4 w-40 mb-2" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-5/6 mt-1" />
              </div>
            </div>
          </CardContent>
          <CardFooter className="p-3 pt-0 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="h-3 w-3 rounded-full" />
              <Skeleton className="h-3 w-20" />
            </div>
            <Skeleton className="h-6 w-6 rounded-full" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
