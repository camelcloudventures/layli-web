import { ActiveUser } from "@/lib/types";
import { TemplateOption } from "../types/schedule-form-types";

export interface ActiveUsersResponse {
  data?: ActiveUser[];
}

export interface TemplatesResponse {
  data?: TemplateOption[];
}
