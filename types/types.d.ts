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

export type Org = {
  id: string
  name: string
  type?: string
  created_at: string
  updated_at: string
  created_by: string
}

export type OrgMembership = {
  organization_id: string
  role: string
  is_default: boolean
}

export type OrgContext = {
  user: {
    id: string
    email: string
    full_name?: string
    role?: string
    phone_number?: string
    image?: string
    [key: string]: string | undefined
  }
  organizations: Org[]
  orgMemberships: OrgMembership[]
  activeOrganization: Org | null
}

export interface User {
  id: string
  email: string
  role: string
  created_at: string
  invited_by: string
  organization_id: string
  token: string
  used: boolean
  user: {
    id: string
    full_name: string
    email: string
    role: string
    created_at: string
    user_id: string
  }
}
