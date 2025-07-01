'use client'

import { useState } from 'react'
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
import { Loader2 } from 'lucide-react'

type IProps = {
  notifications: Notification[]
}

export default function Notifications({ notifications }: IProps) {
  const [isMarkingAsRead, setIsMarkingAsRead] = useState(false)
  const unreadNotifications = notifications.filter((n) => !n.is_read)

  const handleMarkAllAsRead = async () => {
    if (isMarkingAsRead) return

    setIsMarkingAsRead(true)
    try {
      await markAllAsRead(notifications.map((n) => n.id))
    } catch (error) {
      console.error('Failed to mark notifications as read:', error)
    } finally {
      setIsMarkingAsRead(false)
    }
  }

  if (unreadNotifications.length === 0) {
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
            <p className="text-sm text-muted-foreground">
              You currently have no notifications.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }
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
          {unreadNotifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
            />
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleMarkAllAsRead}
          variant="ghost"
          size="sm"
          className="w-full"
          disabled={isMarkingAsRead}
        >
          {isMarkingAsRead ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Marking as read...
            </>
          ) : (
            'Mark all as read'
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
