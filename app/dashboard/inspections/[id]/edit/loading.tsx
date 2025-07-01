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
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-2 w-full mt-2" />
      </div>

      <div className="border rounded-md">
        <div className="p-4 border-b">
          <div className="flex space-x-2">
            <Skeleton className="h-10 w-[100px]" />
            <Skeleton className="h-10 w-[100px]" />
            <Skeleton className="h-10 w-[100px]" />
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            <Skeleton className="h-[200px] w-full" />
            <Skeleton className="h-[200px] w-full" />
          </div>
        </div>
      </div>

      <div className="border rounded-md p-6">
        <Skeleton className="h-6 w-[150px] mb-4" />
        <Skeleton className="h-10 w-full mb-4" />
        <div className="flex justify-end">
          <Skeleton className="h-10 w-[150px]" />
        </div>
      </div>
    </div>
  )
}
