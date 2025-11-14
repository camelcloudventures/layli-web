export type IssuePriority = "low" | "medium" | "high" | "critical";
export type IssueStatus = "open" | "in_progress" | "resolved" | "closed";
export type IssueCategory =
  | "safety"
  | "compliance"
  | "operational"
  | "environmental"
  | "quality"
  | "other";

export interface IssueFile {
  id: string;
  issue_id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  uploaded_at: string;
}

export interface IssueAttachment {
  id: string;
  file_url: string;
  file_name: string;
  issue_id: string;
  created_at: string;
  created_by: string;
}

export interface IssueComment {
  id: string;
  comment: string;
  issue_id: string;
  created_at: string;
  created_by:
    | string
    | {
        id: string;
        role: string;
        email: string;
        full_name?: string;
      };
}

export interface IssueAssignee {
  id: string;
  role: string;
  email: string;
  full_name: string;
}

export interface IssueSite {
  id: number;
  name: string;
  address: string;
}

export interface Issue {
  id: string;
  code?: string | null;
  category: IssueCategory;
  title: string;
  description: string;
  site_id: number;
  location: string;
  cause?: string | null;
  solution?: string | null;
  due_at: string;
  date_occurred: string;
  created_at: string;
  updated_at: string;
  reporter: {
    id: string;
    full_name: string;
    email: string;
    role: string;
  };
  // created_by: string
  status: IssueStatus;
  priority: IssuePriority;
  organization_id: string;
  assignees: IssueAssignee[];
  site: IssueSite;
  attachments: IssueAttachment[];
  comments: IssueComment[];

  // Legacy fields for backward compatibility
  reporter_id?: string;
  reporter_name?: string;
  reporter_image?: string;
  assignee_id?: string;
  assignee_name?: string;
  assignee_image?: string;
  audit_id?: string;
  audit_name?: string;
  due_date?: string;
  files?: IssueFile[];
}
