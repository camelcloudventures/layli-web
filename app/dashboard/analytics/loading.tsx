import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function AnalyticsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-48 bg-muted/50 rounded-md mb-2"></div>
          <div className="h-4 w-64 bg-muted/30 rounded-md"></div>
        </div>
        <div className="h-10 w-[180px] bg-muted/50 rounded-md"></div>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="h-20 bg-muted/50"></CardHeader>
            <CardContent className="h-10 bg-muted/30 mt-2"></CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <div className="h-10 w-full max-w-md bg-muted/50 rounded-md"></div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-6 w-48 bg-muted/50 rounded-md mb-2"></div>
            <div className="h-4 w-64 bg-muted/30 rounded-md"></div>
          </CardHeader>
          <CardContent className="h-[300px] bg-muted/20"></CardContent>
        </Card>
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-6 w-48 bg-muted/50 rounded-md mb-2"></div>
            <div className="h-4 w-64 bg-muted/30 rounded-md"></div>
          </CardHeader>
          <CardContent className="h-[300px] bg-muted/20"></CardContent>
        </Card>
      </div>
    </div>
  )
}
