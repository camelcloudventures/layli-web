type UserRole = "admin" | "auditor" | "supervisor";

// export interface Invite {
//   data: {
//     id: string
//     email: string
//     role: UserRole
//     token: string
//     invited_by: string
//     created_at: string
//     used: boolean
//   }[]
// }

export type Org = {
  id: string;
  name: string;
  type?: string;
  created_at: string;
  updated_at: string;
  created_by: string;
};

export type OrgMembership = {
  organization_id: string;
  role: string;
  is_default: boolean;
};

export type OrgContext = {
  user: {
    id: string;
    email: string;
    full_name?: string;
    role?: string;
    phone_number?: string;
    image?: string;
    [key: string]: string | undefined;
  };
  organizations: Org[];
  orgMemberships: OrgMembership[];
  activeOrganization: Org | null;
};

export interface User {
  id: string;
  email: string;
  role: string;
  created_at: string;
  invited_by: string;
  organization_id: string;
  token: string;
  used: boolean;
  user: {
    id: string;
    full_name: string;
    email: string;
    role: string;
    created_at: string;
    user_id: string;
  };
}

export type ActiveUser = {
  data: User[];
};

export type Assignee = {
  id: string;
  full_name: string;
  email: string;
  role: string;
};

// Re-export types from issue-types to maintain compatibility
export type {
  Issue,
  IssueAttachment,
  IssueComment,
  IssueAssignee,
  IssueSite,
  IssuePriority,
  IssueStatus,
  IssueCategory,
} from "./types/issue-types";

export enum Priority {
  low = "low",
  medium = "medium",
  high = "high",
}

export enum Status {
  OPEN = "open",
  IN_PROGRESS = "in_progress",
  RESOLVED = "resolved",
  CLOSED = "closed",
}

export enum Category {
  safety = "safety",
  quality = "quality",
  productivity = "productivity",
  environment = "environment",
}

export enum Frequency {
  ONE_TIME = "one_time",
  DAILY = "daily",
  WEEKLY = "weekly",
  MONTHLY = "monthly",
  YEARLY = "yearly",
}

//Will be updated
export type Site = {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
};

export enum ActionFrequency {
  ONE_TIME = "one_time",
  DAILY = "daily",
  WEEKLY = "weekly",
  MONTHLY = "monthly",
  YEARLY = "yearly",
}
export enum ActionPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
}
export enum ActionStatus {
  TODO = "todo",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  DONE = "done",
}

export type Action = {
  id: string;
  code: string | null;
  title: string;
  description: string;
  status: ActionStatus;
  priority: ActionPriority;
  due_at: string;
  frequency: ActionFrequency;
  assignees: Assignee[];
  site_id: number;
  label: string;
  created_at: string;
  created_by: Assignee;
  organization_id: string;
  site: {
    id: number;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
  };
};
