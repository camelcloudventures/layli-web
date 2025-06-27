'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { NotificationItem } from '../components/notification-item'
import { Notification } from '@/lib/types/notifications'
import { markAllAsRead } from '../actions/actions'

type IProps = {
  notifications: Notification[]
}

export default function Notifications({ notifications }: IProps) {
  console.log('notifications', notifications)
  return (
    <Card className=" ">
      <CardHeader>
        <CardTitle>Notifications </CardTitle>
        <CardDescription>
          Stay updated with the latest activities
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {notifications
            .filter((n) => !n.is_read)
            .map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
              />
            ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={async () => {
            await markAllAsRead(notifications.map((n) => n.id))
          }}
          variant="ghost"
          size="sm"
          className="w-full"
        >
          Mark all as read
        </Button>
      </CardFooter>
    </Card>
  )
}
