import type { Frequency } from '@/lib/types/schedule-types'

// Calculate next audit date based on frequency and a start date
export const calculateNextAuditDate = (
  frequency: Frequency,
  startDate: Date = new Date(),
): string => {
  const date = new Date(startDate)

  switch (frequency) {
    case 'daily':
      date.setDate(date.getDate() + 1)
      break
    case 'weekly':
      date.setDate(date.getDate() + 7)
      break
    case 'monthly':
      date.setMonth(date.getMonth() + 1)
      break
    case 'yearly':
      date.setFullYear(date.getFullYear() + 1)
      break
  }

  return date.toISOString()
}
//eslint-disable-next-line @typescript-eslint/no-explicit-any
export const formatDate = (date: string | number | any) => {
  return new Date(date).toLocaleString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  })
}
export function formatTime12hr(time: string) {
  if (!time) return ''
  const [hourStr, minuteStr] = time.split(':')
  let hour = parseInt(hourStr, 10)
  const minute = minuteStr
  const ampm = hour >= 12 ? 'PM' : 'AM'
  hour = hour % 12 || 12
  return `${hour}:${minute} ${ampm}`
}
