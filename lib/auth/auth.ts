export enum Role {
  ADMIN = 'admin',
  SUPERVISOR = 'supervisor',
  AUDITOR = 'auditor',
}

export enum Permission {
  VIEW_ALL_AUDITS = 'view_all_audits',
  VIEW_ASSIGNED_AUDITS = 'view_assigned_audits',
  CREATE_AUDITS = 'create_audits',
  EDIT_AUDITS = 'edit_audits',
  DELETE_AUDITS = 'delete_audits',
  ASSIGN_AUDITS = 'assign_audits',
  SCHEDULE_AUDITS = 'schedule_audits',
  VIEW_AUDIT_SCHEDULES = 'view_audit_schedules',
  PERFORM_AUDITS = 'perform_audits',
  SUBMIT_FINDINGS = 'submit_findings',
  EDIT_FINDINGS = 'edit_findings',
  DELETE_FINDINGS = 'delete_findings',
  CREATE_ACTIONS = 'create_actions',
  ASSIGN_ACTIONS = 'assign_actions',
  VIEW_ALL_ACTIONS = 'view_all_actions',
  UPLOAD_EVIDENCE = 'upload_evidence',
  COMMENT = 'comment',
  EDIT_TEMPLATES = 'edit_templates',
  MANAGE_USERS = 'manage_users',
  VIEW_REPORTS = 'view_reports',
}

export const rolePermissions: Record<Role, Permission[]> = {
  [Role.ADMIN]: [
    Permission.VIEW_ALL_AUDITS,
    Permission.VIEW_ASSIGNED_AUDITS,
    Permission.CREATE_AUDITS,
    Permission.EDIT_AUDITS,
    Permission.DELETE_AUDITS,
    Permission.ASSIGN_AUDITS,
    Permission.SCHEDULE_AUDITS,
    Permission.VIEW_AUDIT_SCHEDULES,
    Permission.PERFORM_AUDITS,
    Permission.SUBMIT_FINDINGS,
    Permission.EDIT_FINDINGS,
    Permission.DELETE_FINDINGS,
    Permission.CREATE_ACTIONS,
    Permission.ASSIGN_ACTIONS,
    Permission.VIEW_ALL_ACTIONS,
    Permission.UPLOAD_EVIDENCE,
    Permission.COMMENT,
    Permission.EDIT_TEMPLATES,
    Permission.MANAGE_USERS,
    Permission.VIEW_REPORTS,
  ],
  [Role.SUPERVISOR]: [
    Permission.VIEW_ALL_AUDITS,
    Permission.VIEW_ASSIGNED_AUDITS,
    Permission.CREATE_AUDITS,
    Permission.EDIT_AUDITS,
    Permission.ASSIGN_AUDITS,
    Permission.SCHEDULE_AUDITS,
    Permission.VIEW_AUDIT_SCHEDULES,
    Permission.PERFORM_AUDITS,
    Permission.SUBMIT_FINDINGS,
    Permission.EDIT_FINDINGS,
    Permission.CREATE_ACTIONS,
    Permission.ASSIGN_ACTIONS,
    Permission.VIEW_ALL_ACTIONS,
    Permission.UPLOAD_EVIDENCE,
    Permission.COMMENT,
    Permission.VIEW_REPORTS,
  ],
  [Role.AUDITOR]: [
    Permission.VIEW_ASSIGNED_AUDITS,
    Permission.VIEW_AUDIT_SCHEDULES,
    Permission.PERFORM_AUDITS,
    Permission.SUBMIT_FINDINGS,
    Permission.EDIT_FINDINGS,
    Permission.CREATE_ACTIONS,
    Permission.UPLOAD_EVIDENCE,
    Permission.COMMENT,
    Permission.VIEW_REPORTS,
  ],
}

// auth.ts
export function hasPermission(
  user: { id: string; role?: string } | null,
  permission: Permission,
): boolean {
  if (!user) return false

  console.log('user here is ', user)
  console.log('permission', permission)
  // Only treat it as a valid Role if it’s one of the enum values
  if (!Object.values(Role).includes(user.role as Role)) {
    console.warn(`Unknown role "${user.role}" for user ${user.id}`)
    return false
  }

  const role = user.role as Role
  return rolePermissions[role]?.includes(permission) ?? false
}
