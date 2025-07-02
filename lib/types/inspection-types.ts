export enum Priority {
  Low = 'low',
  Medium = 'medium',
  High = 'high',
}

export interface InspectionAction {
  id: string
  title: string
  priority: string
  dueDate: Date
  assignee: string
  site: string
  asset: string
  label: string
}

export interface InspectionQuestion {
  id: string
  name: string
  response: boolean | null
  score: number
  note: string
  attachment: string | null
  action: InspectionAction | null
  field_type?: string
  required?: boolean
  is_flagged?: boolean
  flag_rule?: {
    operator?: string
    value?: string | number
    value2?: string | number
  }
  response_options?: string[]
}

export interface InspectionSection {
  id: string
  name: string
  questions: InspectionQuestion[]
}

export interface Location {
  id: string
  name: string
  address: string
}

export interface Inspection {
  id: string
  name: string
  conducted_on: Date
  location: Location
  sections: InspectionSection[]
  user_name: string
  status: 'draft' | 'in_progress' | 'completed'
  last_modified: Date
  completed_on?: Date
  score: number | null
}

export interface User {
  id: string
  name: string
  email: string
  role: string
}

export interface Site {
  id: string
  name: string
  location: string
}

export interface Asset {
  id: string
  name: string
  type: string
  site_id: string
}
