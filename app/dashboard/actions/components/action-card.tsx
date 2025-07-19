"use client"

import { type Action, ActionPriority } from "@/lib/types"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { Calendar, Hash } from "lucide-react"

interface ActionCardProps {
  action: Action
  onClick: () => void
  isDraggable?: boolean
}

const getPriorityBadgeVariant = (priority: ActionPriority) => {
  switch (priority) {
    case ActionPriority.HIGH:
      return "destructive"
    case ActionPriority.MEDIUM:
      return "secondary"
    case ActionPriority.LOW:
      return "outline"
    default:
      return "secondary"
  }
}

export function ActionCard({ action, onClick, isDraggable = true }: ActionCardProps) {
  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-md ${isDraggable ? "hover:scale-[1.02]" : ""}`}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Hash className="h-3 w-3" />
            <span className="font-medium">{action.code}</span>
          </div>
          <Badge variant={getPriorityBadgeVariant(action.priority)} className="text-xs">
            {action.priority}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-sm leading-tight">{action.title}</h3>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{action.description}</p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>{format(new Date(action.due_at), "MMM d, yyyy")}</span>
            </div>
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
              {action.assignees[0]?.full_name
                .split(" ")
                .map((n) => n[0])
                .join("") || "N/A"}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
