export type Frequency = 'daily' | 'weekly' | 'monthly' | 'yearly'

export type Priority = 'low' | 'medium' | 'high'

export interface User {
  id: string
  name: string
  email: string
  role: string
}

export interface Site {
  id: number | string
  name: string
  address?: string
  latitude?: number
  longitude?: number
}

export interface Template {
  id: number | string
  title: string
  photo?: string
  created_at?: string
  created_by?: string
  description?: string
}

export interface Assignee {
  id: string
  full_name: string
  email: string
  image?: string
  role?: string
  created_at?: string
  phone_number?: string | number
  email_verified_at?: string | null
}

export interface Schedule {
  id: number | string
  title: string
  template_id: number | string
  assignee_id: string
  frequency: Frequency
  priority: Priority
  site_id: number | string | null
  createdAt?: string
  created_at?: string
  site: Site | null
  template: Template
  assignee: Assignee
  next_date?: string
  status?: string
}

export interface Pagination {
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface SchedulesResponse {
  success: string
  data: Schedule[]
  pagination: Pagination
}
