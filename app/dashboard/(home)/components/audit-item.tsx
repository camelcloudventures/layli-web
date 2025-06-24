import { Badge } from '@/components/ui/badge'
import { Activity, CheckCircle2, Clock } from 'lucide-react'

interface AuditItemProps {
  id: number | string
  title: string
  status: 'completed' | 'in-progress' | 'pending'
  date: string
  assignedTo?: string
}

export function AuditItem({ title, status, date, assignedTo }: AuditItemProps) {
  // Helper function to get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 hover:bg-green-100'
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100'
    }
  }

  // Helper function to get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case 'in-progress':
        return <Activity className="h-5 w-5 text-blue-500" />
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  return (
    <div className="flex items-center justify-between rounded-lg border p-3">
      <div className="flex items-center gap-4">
        {getStatusIcon(status)}
        <div>
          <p className="font-medium">{title}</p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Due: {new Date(date).toLocaleDateString()}</span>
            {assignedTo && (
              <>
                <span>•</span>
                <span>Assigned to: {assignedTo}</span>
              </>
            )}
          </div>
        </div>
      </div>
      <Badge className={getStatusColor(status)}>{status}</Badge>
    </div>
  )
}
