import { mockTemplates } from "./mock-templates"

// Mock users for assignees
const mockUsers = [
  { id: "user-1", name: "Sarah Williams", email: "sarah@example.com", role: "auditor" },
  { id: "user-2", name: "Alex Johnson", email: "alex@example.com", role: "supervisor" },
  { id: "user-3", name: "Miguel Rodriguez", email: "miguel@example.com", role: "auditor" },
]

// Mock sites
const mockSites = [
  { id: "site-1", name: "Main Office", address: "123 Business Ave, New York, NY 10001" },
  { id: "site-2", name: "Manufacturing Plant", address: "456 Industrial Blvd, Chicago, IL 60007" },
  { id: "site-3", name: "Distribution Center", address: "789 Logistics Way, Dallas, TX 75001" },
]

// Calculate next audit date based on frequency and a start date
const calculateNextAuditDate = (frequency: string, startDate: Date = new Date()): string => {
  const date = new Date(startDate)

  switch (frequency) {
    case "daily":
      date.setDate(date.getDate() + 1)
      break
    case "weekly":
      date.setDate(date.getDate() + 7)
      break
    case "monthly":
      date.setMonth(date.getMonth() + 1)
      break
    case "yearly":
      date.setFullYear(date.getFullYear() + 1)
      break
  }

  return date.toISOString()
}

// Mock schedules
export const mockSchedules = [
  {
    id: "schedule-1",
    title: "Weekly Safety Inspection",
    template: mockTemplates[0], // Health and Safety Audit
    site: mockSites[1], // Manufacturing Plant
    assignee: mockUsers[0], // Sarah Williams
    frequency: "weekly",
    nextAuditDate: calculateNextAuditDate("weekly"),
    createdAt: new Date("2023-04-10").toISOString(),
  },
  {
    id: "schedule-2",
    title: "Monthly Quality Control",
    template: mockTemplates[1], // Quality Assurance Audit
    site: mockSites[0], // Main Office
    assignee: mockUsers[1], // Alex Johnson
    frequency: "monthly",
    nextAuditDate: calculateNextAuditDate("monthly"),
    createdAt: new Date("2023-03-15").toISOString(),
  },
  {
    id: "schedule-3",
    title: "Annual Environmental Review",
    template: mockTemplates[2], // Environmental Compliance Audit
    site: mockSites[2], // Distribution Center
    assignee: mockUsers[2], // Miguel Rodriguez
    frequency: "yearly",
    nextAuditDate: calculateNextAuditDate("yearly"),
    createdAt: new Date("2023-01-05").toISOString(),
  },
]

// Export mock data for use in components
export { mockUsers, mockSites }
