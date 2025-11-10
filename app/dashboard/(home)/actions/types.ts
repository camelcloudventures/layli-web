export interface InspectionDashboardType {
  id: string;
  title: string;
  description: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  completed_at?: string | null;
  started_at?: string | null;
  paused_at?: string | null;
  due_date?: string | null;
  site_id: string | number | null;
  template_id: string | number | null;
  schedule_id?: string | number | null;
  assignee_id?: string | null;
  assignee_ids?: string[];
  assignees?: Array<{
    id: string;
    full_name: string;
    email: string;
    role: string;
  }>;
  final_score?: number | null;
  final_grade?: string | null;
  passed?: boolean | null;
  total_points_earned?: number;
  total_points_possible?: number;
  critical_violations?: number;
  major_violations?: number;
  minor_violations?: number;
  prepared_by?: string;
  organization_id?: string;
}
