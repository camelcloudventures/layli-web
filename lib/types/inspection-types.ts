export enum Priority {
  Low = "low",
  Medium = "medium",
  High = "high",
}

export interface InspectionAction {
  id: string;
  title: string;
  priority: string;
  dueDate: Date;
  assignee: string;
  site: string;
  asset: string;
  label: string;
}

export interface InspectionQuestion {
  id: string;
  name: string;
  response: boolean | null;
  score: number;
  note: string;
  attachment: string | null;
  action: InspectionAction | null;
  field_type?: string;
  required?: boolean;
  is_flagged?: boolean;
  flag_rule?: {
    operator?: string;
    value?: string | number;
    value2?: string | number;
  };
  response_options?: string[];
}

export interface InspectionSection {
  id: string;
  name: string;
  questions: InspectionQuestion[];
}

export interface Location {
  id: string;
  name: string;
  address: string;
}

export interface ResponseOption {
  id: number;
  label: string;
  code: string;
  sort_order: number;
  is_flagged: boolean;
  color: string;
}

export interface FlagRule {
  operator: "equals" | "not_equals" | "greater_than" | "less_than" | "between";
  value: string | number;
  value2?: string | number;
}

export interface Question {
  id: number;
  text: string;
  weight: number;
  ordinal: number;
  page_id: number | null;
  required: boolean;
  flag_rule: FlagRule | null;
  max_value: number;
  min_value: number;
  auto_score: boolean;
  created_at: string;
  field_type:
    | "TEXT"
    | "DATE"
    | "PERSON"
    | "LOCATION"
    | "NUMBER"
    | "BOOLEAN"
    | "PHOTO"
    | "SELECT"
    | "MULTI_SELECT"
    | "SIGNATURE"
    | "SLIDER"
    | "ASSET"
    | "CHECKBOX";
  is_flagged: boolean | null;
  risk_level: "minor" | "major" | "critical";
  section_id: number;
  step_value: number;
  point_value: number;
  organization_id: string | null;
  response_options: ResponseOption[];
  multiple_selection: boolean;
  parent_question_id?: number;
  trigger?: {
    value: string | number | boolean;
    operator: "equals" | "not_equals" | "contains";
  };
}

export interface Section {
  id: number;
  title: string;
  ordinal: number;
  page_id: number;
  organization_id: string | null;
  created_at: string;
  questions: Question[];
}

export interface Page {
  id: number;
  title: string;
  description: string | null;
  ordinal: number | null;
  template_id: string | null;
  inspection_id: string;
  organization_id: string;
  photo: string | null;
  created_at: string;
  sections: Section[];
}

export interface SectionScore {
  section_id: number;
  score: number;
  total_possible: number;
}

export interface Response {
  id?: string;
  question_id: number;
  value: string;
  selected_options: number[];
  response_value: string;
  file_attachments?: {
    filename: string;
    file_path: string;
    file_size: number;
    mime_type: string;
  }[];
  inspector_notes?: string;
  created_at?: string;
  updated_at?: string;
  inspection_id?: string;
  points_earned?: number;
  points_possible?: number;
  manual_score?: boolean;
  text_value?: string | null;
  numeric_value?: number | null;
  location_data?: {
    address?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    place_id?: string | null;
  } | null;
  action_id?: string;
}

export interface Violation {
  question_id: number;
  risk_level: "minor" | "major" | "critical";
  description: string;
}

export interface Site {
  id: string;
  name: string;
  address?: string;
}

export interface Template {
  id: string;
  title: string;
  description: string | null;
  photo: string | null;
  pages: Page[];
}

export enum InspectionStatus {
  PENDING = "pending",
  IN_PROGRESS = "in_progress",
  PAUSED = "paused",
  COMPLETED = "completed",
  DONE = "done",
  CANCELLED = "cancelled",
}

export interface InspectionAssignee {
  id: string;
  full_name: string;
  email: string;
  role: string;
}

export interface Inspection {
  id: string;
  title: string;
  description: string | null;
  organization_id: string;
  created_at: string;
  updated_at: string;
  prepared_by: string;
  assignee_id: string | null;
  assignee_ids: string[];
  assignees?: InspectionAssignee[];
  site_id: string | null;
  site: Site | null;
  template_id: string | null;
  template: Template | null;
  schedule_id: string | null;
  status: InspectionStatus;
  started_at: string | null;
  completed_at: string | null;
  paused_at: string | null;
  due_date: string | null;
  passed: boolean | null;
  final_grade: string | null;
  final_score: number | null;
  total_points_earned: number;
  total_points_possible: number;
  critical_violations: number;
  major_violations: number;
  minor_violations: number;
  section_scores: SectionScore[];
  responses: Response[];
  violations: Violation[];
  pages: Page[];
}

export interface LocationData {
  address: string;
  latitude: number;
  longitude: number;
  place_id?: string;
}

export interface LocationResponse {
  selected_options: number[];
  response_value: string;
  location_data?: LocationData;
  inspector_notes?: string;
  file_attachments?: Array<{
    filename: string;
    file_path: string;
    file_size: number;
    mime_type: string;
  }>;
}

export interface User {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;

    full_name: string;
  };
}

export interface Asset {
  id: string;
  name: string;
  type: string;
  site_id: string;
}

export interface Response {
  selected_options: number[];
  response_value: string;
  inspector_notes?: string;
  file_attachments?: {
    filename: string;
    file_path: string;
    file_size: number;
    mime_type: string;
  }[];
  action_required?: boolean;
}
