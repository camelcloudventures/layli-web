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
