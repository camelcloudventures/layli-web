import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Skeleton className="h-10 w-10 mr-4" />
          <div>
            <Skeleton className="h-8 w-[200px]" />
            <Skeleton className="h-4 w-[150px] mt-2" />
          </div>
        </div>
        <Skeleton className="h-10 w-[150px]" />
      </div>

      <div className="border rounded-md p-6">
        <Skeleton className="h-6 w-[150px] mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>

      {[...Array(3)].map((_, i) => (
        <div key={i} className="border rounded-md p-6">
          <Skeleton className="h-6 w-[150px] mb-4" />
          <div className="space-y-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </div>
      ))}
    </div>
  )
}
