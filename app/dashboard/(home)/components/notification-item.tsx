import { AlertCircle, CheckCircle2, Info } from 'lucide-react'

interface NotificationItemProps {
  id: number | string
  type: 'info' | 'warning' | 'success'
  message: string
  time: string
}

export function NotificationItem({
  type,
  message,
  time,
}: NotificationItemProps) {
  // Helper function to get notification icon
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case 'success':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      default:
        return <Info className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="flex items-start gap-3 rounded-lg border p-3">
      {getNotificationIcon(type)}
      <div className="flex-1">
        <p className="font-medium">{message}</p>
        <p className="text-xs text-muted-foreground">{time}</p>
      </div>
    </div>
  )
}
