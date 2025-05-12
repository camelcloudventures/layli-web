// Invite types

type UserRole = 'admin' | 'auditor' | 'supervisor'

export interface Invite {
  data: {
    id: string
    email: string
    role: UserRole
    token: string
    invited_by: string
    created_at: string
    used: boolean
  }[]
}
