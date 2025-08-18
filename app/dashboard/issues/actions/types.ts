import { Issue } from "@/lib/types";

// Interface for issue data
interface IssueDashboardType {
  id: string;
  title: string;
  category: string;
  status: string;
  priority: string;
  due_at: string;
  created_at: string;
  assignees: Array<{
    id: string;
    full_name: string;
    email: string;
    role: string;
  }>;
}

export interface IssuesResponse {
  data: Issue[];
  success: boolean;
}
