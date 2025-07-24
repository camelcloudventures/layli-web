export interface InspectionAssignee {
  id: string
  full_name: string
  email: string
  role: string
}

export interface InspectionResponse {
  id: string
  question_id: number
  response_value?: string
  text_value?: string
  numeric_value?: number
  selected_options: string[]
  points_earned: number
  points_possible: number
  is_flagged: boolean
  flag_reason?: string
  inspector_notes?: string
  file_attachments: unknown[]
  location_data?: unknown
  manual_score: boolean
  action?: unknown
  action_id?: string
  created_at: string
  updated_at: string
}

export interface SectionScore {
  id: string
  section_id: number
  section_grade: string
  section_score: number
  points_earned: number
  points_possible: number
  created_at: string
  updated_at: string
}

export interface InspectionQuestion {
  id: number
  title: string
  description?: string
  question_type: string
  required: boolean
  points: number
  options?: string[]
  // Add other question properties as needed
}

export interface InspectionSection {
  id: number
  title: string
  ordinal: number
  questions: InspectionQuestion[]
  created_at: string
}

export interface InspectionPage {
  id: number
  title: string
  description?: string
  photo?: string
  ordinal?: number
  sections: InspectionSection[]
  created_at: string
}

export interface Inspection {
  id: string
  title: string
  description: string
  status: string
  final_grade: string
  final_score: number
  passed: boolean
  created_at: string
  completed_at: string
  due_date: string
  critical_violations: number
  major_violations: number
  minor_violations: number
  assignee_id?: string
  assignee_ids: string[]
  assignees: InspectionAssignee[]
  pages: InspectionPage[]
  responses: InspectionResponse[]
  section_scores: SectionScore[]
  schedule_id?: string
  prepared_by: string
  paused_at?: string
}
