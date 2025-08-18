export interface InspectionDashboardType {
  id: string;
  title: string;
  status: string;
  created_at: string;
  completed_at?: string;
  assignees: Array<{
    id: string;
    full_name: string;
    email: string;
    role: string;
  }>;
}
