export type IssuePriority = "low" | "medium" | "high" | "critical"
export type IssueStatus = "open" | "in-progress" | "resolved" | "closed"
export type IssueCategory = "safety" | "compliance" | "operational" | "environmental" | "quality" | "other"

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
