export type ActionStatus = 'todo' | 'in_progress' | 'completed'

export type ActionPriority = 'low' | 'medium' | 'high'

export type ActionFrequency = 'daily' | 'weekly' | 'monthly' | 'yearly'

export interface Action {
  id: string
  code: string
  title: string
  description: string
  status: ActionStatus
  priority: ActionPriority
  due_at: string
  frequency: ActionFrequency
  assignee_id: string
  site_id: string
  label: string
  created_at: string
  created_by_id: string
}

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

export interface Site {
  id: string
  name: string
}
