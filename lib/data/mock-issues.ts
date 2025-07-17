import type { Issue, IssueFile, IssueComment } from '../types/issue-types'
import { mockUsers } from '@/lib/data/mock-schedules'

// Mock issue files
const mockIssueFiles: IssueFile[] = [
  {
    id: 'file-1',
    issue_id: 'issue-1',
    name: 'safety-report.pdf',
    url: '/files/safety-report.pdf',
    size: 2457600, // Size in bytes (2.4 MB)
    type: 'application/pdf',
    uploaded_at: new Date('2023-04-15T09:30:00').toISOString(),
  },
  {
    id: 'file-2',
    issue_id: 'issue-1',
    name: 'hazard-photo.jpg',
    url: '/files/hazard-photo.jpg',
    size: 1843200, // Size in bytes (1.8 MB)
    type: 'image/jpeg',
    uploaded_at: new Date('2023-04-15T09:32:00').toISOString(),
  },
  {
    id: 'file-3',
    issue_id: 'issue-2',
    name: 'compliance-checklist.xlsx',
    url: '/files/compliance-checklist.xlsx',
    size: 524288, // Size in bytes (512 KB)
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    uploaded_at: new Date('2023-04-18T14:20:00').toISOString(),
  },
]

// Mock issue comments
const mockIssueComments: IssueComment[] = [
  {
    id: 'comment-1',
    issue_id: 'issue-1',
    user_id: 'user-1',
    user_name: 'Sarah Williams',
    text: "I've assigned a team to address this safety concern immediately.",
    created_at: new Date('2023-04-15T10:15:00').toISOString(),
  },
  {
    id: 'comment-2',
    issue_id: 'issue-1',
    user_id: 'user-2',
    user_name: 'Alex Johnson',
    text:
      "Thanks, Sarah. I'll follow up with the maintenance team to ensure the guardrails are properly installed.",
    created_at: new Date('2023-04-15T11:30:00').toISOString(),
  },
  {
    id: 'comment-3',
    issue_id: 'issue-2',
    user_id: 'user-3',
    user_name: 'Miguel Rodriguez',
    text:
      "I've reviewed the compliance gaps and created an action plan to address them.",
    created_at: new Date('2023-04-18T15:45:00').toISOString(),
  },
]

// Mock issues
export const mockIssues: Issue[] = [
  {
    id: 'issue-1',
    title: 'Missing guardrails on platform 3',
    description:
      'During the latest safety audit, we noticed that platform 3 in the manufacturing area lacks proper guardrails, creating a fall hazard for workers.',
    category: 'safety',
    priority: 'high',
    status: 'in-progress',
    reporter_id: 'user-2',
    reporter_name: 'Alex Johnson',
    assignee_id: 'user-1',
    assignee_name: 'Sarah Williams',
    audit_id: 'audit-1',
    audit_name: 'Monthly Safety Inspection',
    created_at: new Date('2023-04-15T09:20:00').toISOString(),
    updated_at: new Date('2023-04-15T09:20:00').toISOString(),
    due_date: new Date('2023-04-20').toISOString(),
    files: mockIssueFiles.filter((file) => file.issue_id === 'issue-1'),
    comments: mockIssueComments.filter(
      (comment) => comment.issue_id === 'issue-1',
    ),
  },
  {
    id: 'issue-2',
    title: 'Environmental compliance gaps in waste handling',
    description:
      "Audit revealed several gaps in our waste handling procedures that don't align with the updated environmental regulations from Q1 2023.",
    category: 'compliance',
    priority: 'medium',
    status: 'open',
    reporter_id: 'user-1',
    reporter_name: 'Sarah Williams',
    assignee_id: 'user-3',
    assignee_name: 'Miguel Rodriguez',
    audit_id: 'audit-3',
    audit_name: 'Environmental Compliance Review',
    created_at: new Date('2023-04-18T14:15:00').toISOString(),
    updated_at: new Date('2023-04-18T14:15:00').toISOString(),
    due_date: new Date('2023-04-30').toISOString(),
    files: mockIssueFiles.filter((file) => file.issue_id === 'issue-2'),
    comments: mockIssueComments.filter(
      (comment) => comment.issue_id === 'issue-2',
    ),
  },
  {
    id: 'issue-3',
    title: 'Quality control failures in production line B',
    description:
      'Multiple products from production line B failed quality checks last week. Initial investigation shows potential calibration issues with the automated inspection system.',
    category: 'quality',
    priority: 'critical',
    status: 'open',
    reporter_id: 'user-3',
    reporter_name: 'Miguel Rodriguez',
    assignee_id: 'user-2',
    assignee_name: 'Alex Johnson',
    audit_id: 'audit-2',
    audit_name: 'Weekly Quality Assurance Check',
    created_at: new Date('2023-04-19T10:30:00').toISOString(),
    updated_at: new Date('2023-04-19T10:30:00').toISOString(),
    due_date: new Date('2023-04-22').toISOString(),
    files: [],
    comments: [],
  },
  {
    id: 'issue-4',
    title: 'Fire extinguisher inspection overdue',
    description:
      'The monthly inspection of fire extinguishers in the east wing is overdue by 15 days.',
    category: 'safety',
    priority: 'medium',
    status: 'resolved',
    reporter_id: 'user-2',
    reporter_name: 'Alex Johnson',
    assignee_id: 'user-1',
    assignee_name: 'Sarah Williams',
    audit_id: 'audit-1',
    audit_name: 'Monthly Safety Inspection',
    created_at: new Date('2023-03-20T11:45:00').toISOString(),
    updated_at: new Date('2023-04-05T16:20:00').toISOString(),
    due_date: new Date('2023-03-25').toISOString(),
    files: [],
    comments: [],
  },
  {
    id: 'issue-5',
    title: 'Operator training documentation missing',
    description:
      'Training documentation for 3 new operators on the assembly line could not be located during the audit.',
    category: 'compliance',
    priority: 'low',
    status: 'closed',
    reporter_id: 'user-1',
    reporter_name: 'Sarah Williams',
    assignee_id: 'user-3',
    assignee_name: 'Miguel Rodriguez',
    audit_id: 'audit-5',
    audit_name: 'HR Compliance Review',
    created_at: new Date('2023-03-15T09:15:00').toISOString(),
    updated_at: new Date('2023-03-18T14:30:00').toISOString(),
    due_date: new Date('2023-03-22').toISOString(),
    files: [],
    comments: [],
  },
]

// Export mock data for use in components
export { mockUsers, mockIssueFiles, mockIssueComments }
