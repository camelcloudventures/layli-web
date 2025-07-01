import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Skeleton className="h-10 w-10 mr-4" />
        <Skeleton className="h-8 w-[200px]" />
      </div>

      <div className="border rounded-md p-6">
        <Skeleton className="h-6 w-[150px] mb-4" />
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <div className="flex justify-end">
            <Skeleton className="h-10 w-[120px]" />
          </div>
        </div>
      </div>
    </div>
  )
}
