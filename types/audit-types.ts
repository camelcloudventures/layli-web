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
  id: string
  question_id: string
  label: string
  code: string
  sort_order: number
  score: number
  is_flagged: boolean
  color: string
}

export interface LocationData {
  latitude: number
  longitude: number
  address: string
  place_id?: string
}

export interface SignatureData {
  image_url: string
  timestamp: string
}

export interface Question {
  id: string
  page_id: string
  section_id: string
  text: string
  required: boolean
  multiple_selection: boolean
  is_flagged: boolean
  field_type:
    | 'BOOLEAN'
    | 'TEXT'
    | 'DATE'
    | 'PHOTO'
    | 'NUMBER'
    | 'SELECT'
    | 'MULTI_SELECT'
    | 'SIGNATURE'
    | 'LOCATION'
    | 'SLIDER'
    | 'PERSON'
    | 'ASSET'
  ordinal: number
  response_options?: ResponseOption[]
  location_data?: LocationData
  signature_data?: SignatureData
  slider_value?: number
  asset_file?: string
  flag_rule?: {
    operator?: string
    value?: string | number
    value2?: string | number
  }
}

export interface Section {
  id: string
  page_id: string
  title: string
  ordinal: number
  questions: Question[]
}

export interface Page {
  id: string
  template_id: string
  title: string
  description: string
  photo?: string
  ordinal: number
  sections: Section[]
}

export interface AuditTemplate {
  id: string
  title: string
  description: string
  photo?: string
  pages: Page[]
  created_at?: Date | string
  updated_at?: Date | string
  created_by?: string
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
  location_data?: LocationData
  signature_data?: SignatureData
  slider_value?: number
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

// Types for creating new items (without IDs)
export interface NewResponseOption {
  question_id: string
  label: string
  code: string
  sort_order: number
  score: number
  is_flagged: boolean
  color: string
}

export interface NewQuestion {
  page_id: string
  section_id: string
  text: string
  required: boolean
  multiple_selection: boolean
  is_flagged: boolean
  field_type:
    | 'BOOLEAN'
    | 'TEXT'
    | 'DATE'
    | 'PHOTO'
    | 'NUMBER'
    | 'SELECT'
    | 'MULTI_SELECT'
    | 'SIGNATURE'
    | 'LOCATION'
    | 'SLIDER'
    | 'PERSON'
    | 'ASSET'
  ordinal: number
  response_options?: NewResponseOption[]
  location_data?: LocationData
  signature_data?: SignatureData
  slider_value?: number
  asset_file?: string
}

export interface NewSection {
  page_id: string
  title: string
  ordinal: number
  questions: NewQuestion[]
}

export interface NewPage {
  template_id: string
  title: string
  description: string
  photo?: string
  ordinal: number
  sections: NewSection[]
}

export interface NewAuditTemplate {
  title: string
  description: string
  photo?: string
  pages: NewPage[]
  created_at?: Date | string
  updated_at?: Date | string
  created_by?: string
}
