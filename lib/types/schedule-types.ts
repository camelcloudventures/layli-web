import type { AuditTemplate } from "./audit-types"

export type Frequency = "daily" | "weekly" | "monthly" | "yearly"

export interface User {
  id: string
  name: string
  email: string
  role: string
}

export interface Site {
  id: string
  name: string
  address: string
}

export interface Schedule {
  id: string
  title: string
  template_id: string
  site_id: string
  assignee_id: string
  frequency: Frequency
  template?: AuditTemplate
  site?: Site
  assignee?: User
  nextAuditDate?: string
  createdAt?: string
}
