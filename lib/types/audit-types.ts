export type IssuePriority = 'low' | 'medium' | 'high' | 'critical'
export type IssueStatus = 'open' | 'in-progress' | 'resolved' | 'closed'
export type IssueCategory =
  | 'safety'
  | 'compliance'
  | 'operational'
  | 'environmental'
  | 'quality'
  | 'other'

export interface IssueFile {
  id: string
  issue_id: string
  name: string
  url: string
  size: number
  type: string
  uploaded_at: string
}

export interface IssueComment {
  id: string
  issue_id: string
  user_id: string
  user_name: string
  user_image?: string
  text: string
  created_at: string
}

export interface Issue {
  id: string
  title: string
  description: string
  category: IssueCategory
  priority: IssuePriority
  status: IssueStatus
  reporter_id: string
  reporter_name: string
  reporter_image?: string
  assignee_id?: string
  assignee_name?: string
  assignee_image?: string
  audit_id?: string
  audit_name?: string
  created_at: string
  updated_at: string
  due_date?: string
  files?: IssueFile[]
  comments?: IssueComment[]
}

export interface ResponseOption {
  id: number
  code: string
  color: string
  label: string
  score: number
  created_at: string
  is_flagged: boolean
  sort_order: number
  question_id: number
}

export interface PersonOption {
  id: number
  name: string
}

export interface Question {
  id: number
  text: string
  ordinal: number
  page_id: number
  required: boolean
  created_at: string
  field_type: string
  is_flagged: boolean
  section_id: number
  response_options: ResponseOption[]
  multiple_selection: boolean
  person_options: PersonOption[]
  asset_file: string
}

export interface Section {
  id: number
  title: string
  ordinal: number
  page_id: number
  questions: Question[]
  created_at: string
}

export interface Page {
  id: number
  photo: string
  title: string
  ordinal: number
  sections: Section[]
  created_at: string
  description: string
  template_id: number
}

export interface AuditTemplate {
  id: number
  created_at: string
  title: string
  description: string
  photo: string
  created_by: string | null
  pages: Page[]
}

export interface Response {
  id: string
  responder_id: string
  audit_id: string
  question_id: string
  text?: string
  media?: string
  number?: number
  checkbox?: boolean
  document?: string
  date_time?: Date
  response_option_id?: string
}

export interface AuditInstance {
  id: string
  template_id: string
  site_id: string
  prepared_by_id: string
  conducted_by_id: string
  audit_date: Date
  status: 'DRAFT' | 'IN_PROGRESS' | 'COMPLETED' | 'APPROVED' | 'REJECTED'
  responses?: Response[]
}

export type Template = AuditTemplate

export interface Pagination {
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface TemplatesResponse {
  success: string
  data: AuditTemplate[]
  pagination: Pagination
}

export type AuditTemplateApiResponse =
  | AuditTemplate
  | { data: AuditTemplate }
  | null
