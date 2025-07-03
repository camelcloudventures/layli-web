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

export interface ResponseOption {
  label: string
  code: string
  sort_order: number
  is_flagged: boolean
  color: string
}

export interface FlagRule {
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'between'
  value: string | number
  value2?: string | number
}

export interface Question {
  id: number
  text: string
  field_type: 'TEXT' | 'RADIO' | 'CHECKBOX' | 'NUMBER' | 'DATE'
  required: boolean
  multiple_selection: boolean
  ordinal: number
  risk_level: 'minor' | 'major' | 'critical'
  response_options: ResponseOption[]
  auto_score: boolean
  max_value?: number
  min_value?: number
  point_value: number
  step_value?: number
  weight: number
  is_flagged: boolean | null
  flag_rule: FlagRule | null
  organization_id: string | null
  page_id: number | null
  section_id: number
  created_at: string
}

export interface Section {
  id: number
  title: string
  ordinal: number
  page_id: number
  organization_id: string | null
  created_at: string
  questions: Question[]
}

export interface Page {
  id: number
  title: string
  description: string | null
  ordinal: number | null
  template_id: string | null
  inspection_id: string
  organization_id: string
  photo: string | null
  created_at: string
  sections: Section[]
}

export interface SectionScore {
  section_id: number
  score: number
  total_possible: number
}

export interface Response {
  question_id: number
  value: string | number | boolean
  note?: string
  attachments?: string[]
}

export interface Violation {
  question_id: number
  risk_level: 'minor' | 'major' | 'critical'
  description: string
}

export interface Site {
  id: string
  name: string
  address?: string
}

export interface Template {
  id: string
  title: string
  description: string | null
  photo: string | null
  pages: Page[]
}

export enum InspectionStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export interface Inspection {
  id: string
  title: string
  description: string | null
  organization_id: string
  created_at: string
  updated_at: string
  prepared_by: string
  assignee_id: string | null
  assignee_ids: string[]
  site_id: string | null
  site: Site | null
  template_id: string | null
  template: Template | null
  schedule_id: string | null
  status: InspectionStatus
  started_at: string | null
  completed_at: string | null
  paused_at: string | null
  due_date: string | null
  passed: boolean | null
  final_grade: string | null
  final_score: number | null
  total_points_earned: number
  total_points_possible: number
  critical_violations: number
  major_violations: number
  minor_violations: number
  section_scores: SectionScore[]
  responses: Response[]
  violations: Violation[]
  pages: Page[]
}

export interface User {
  id: string
  name: string
  email: string
  role: string
}

export interface Asset {
  id: string
  name: string
  type: string
  site_id: string
}
