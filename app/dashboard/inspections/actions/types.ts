import { InspectionDashboardType } from "../../(home)/actions/types";

export interface InspectionsResponse {
  success?: boolean;
  error?: string;
  data?: InspectionDashboardType[];
  pagination?: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}
