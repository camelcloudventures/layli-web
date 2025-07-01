import {
  AlertCircle,
  CheckCircle2,
  Info,
  Flag,
  RefreshCw,
  XCircle,
  Clock,
} from 'lucide-react'
import { format, formatDistanceToNow } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { Notification } from '@/lib/types/notifications'

type NotificationType =
  | 'REMINDER'
  | 'ASSIGNED'
  | 'COMPLETED'
  | 'FLAGGED'
  | 'RESCHEDULED'
  | 'CANCELLED'

interface NotificationItemProps {
  notification: Notification
}

const typeMap = {
  REMINDER: {
    icon: Info,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    badge: 'bg-blue-100 text-blue-800',
  },
  ASSIGNED: {
    icon: AlertCircle,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    badge: 'bg-amber-100 text-amber-800',
  },
  COMPLETED: {
    icon: CheckCircle2,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    badge: 'bg-green-100 text-green-800',
  },
  FLAGGED: {
    icon: Flag,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    badge: 'bg-red-100 text-red-800',
  },
  RESCHEDULED: {
    icon: RefreshCw,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    badge: 'bg-purple-100 text-purple-800',
  },
  CANCELLED: {
    icon: XCircle,
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    badge: 'bg-gray-100 text-gray-800',
  },
}

function formatNotificationMessage(message: string): string {
  // Clean up the message by removing the raw timestamp
  return message.replace(/\s+\d{2}:\d{2}:\d{2}\s+GMT[+-]\d{4}\s+$$[^)]+$$/g, '')
}

export function NotificationItem({ notification }: NotificationItemProps) {
  const normalizedType = notification.type.toUpperCase() as NotificationType
  const { icon: Icon, color, bgColor, borderColor, badge } =
    typeMap[normalizedType] || typeMap.REMINDER

  const createdDate = new Date(notification.created_at)
  const timeAgo = formatDistanceToNow(createdDate, { addSuffix: true })
  const fullDate = format(createdDate, 'PPp')

  const cleanMessage = formatNotificationMessage(notification.message)

  return (
    <div
      className={`relative flex items-start gap-4 rounded-xl border-2 ${borderColor} ${bgColor} p-4 transition-all hover:shadow-md ${
        !notification.is_read ? 'ring-2 ring-blue-100' : ''
      }`}
    >
      {/* Unread indicator */}
      {!notification.is_read && (
        <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-blue-500 ring-2 ring-white" />
      )}

      {/* Icon */}
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-full ${bgColor} border ${borderColor}`}
      >
        <Icon className={`h-5 w-5 ${color}`} />
      </div>

      {/* Content */}
      <div className="flex-1 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-gray-900 leading-tight">
            {notification.title}
          </h3>
          <Badge
            variant="secondary"
            className={`${badge} text-xs font-medium shrink-0`}
          >
            {normalizedType.toLowerCase()}
          </Badge>
        </div>

        <p className="text-sm text-gray-700 leading-relaxed">{cleanMessage}</p>

        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Clock className="h-3 w-3" />
          <span title={fullDate}>{timeAgo}</span>
        </div>
      </div>
    </div>
  )
}
