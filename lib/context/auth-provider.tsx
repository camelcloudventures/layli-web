'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
  Suspense,
} from 'react'
import { createClient } from '@/utils/supabase/client'
import {
  getUserOrganizations,
  logout,
  signIn,
  signUp,
} from '@/app/auth/actions/actions'
import { Org } from '@/types/types'

interface AuthUser {
  id: string
  email: string
  full_name?: string
  role?: string
  phone_number?: string
  image?: string | undefined
  [key: string]: string | undefined
}

interface OrgContextResponse {
  success: boolean
  error?: string
  data?: {
    user: AuthUser
    organizations: Org[]
    orgMemberships: {
      organization_id: string
      role: string
      is_default: boolean
    }[]
    activeOrganization: Org
  }
}

interface AuthContextProps {
  user: AuthUser | null
  loading: boolean
  signIn: typeof signIn
  signUp: typeof signUp
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
  orgs: Org[]
  activeOrg: Org | null
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined)

function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [orgs, setOrgs] = useState<Org[]>([])
  const [activeOrg, setActiveOrg] = useState<Org | null>(null)
  const fetchUser = useCallback(async () => {
    try {
      setLoading(true)
      const supabase = createClient()
      const { data } = await supabase.auth.getUser()

      if (
        !data?.user ||
        typeof data.user.id !== 'string' ||
        typeof data.user.email !== 'string'
      ) {
        setUser(null)
        setOrgs([])
        setActiveOrg(null)
        return
      }

      // Fetch profile data
      const { data: profileData, error: profileError } = await supabase
        .from('profile')
        .select('*')
        .eq('id', data.user.id)
        .single()

      if (profileError) {
        console.error('Error fetching profile:', profileError)
      }

      // Always fetch org context when user exists
      const orgContext = (await getUserOrganizations()) as OrgContextResponse
      console.log('orgContext', orgContext)

      if (!orgContext?.success) {
        console.error('Error fetching organization context:', orgContext?.error)
        // Don't set user to null here, just keep existing org state
      } else if (orgContext.data) {
        setOrgs(orgContext.data.organizations)
        setActiveOrg(orgContext.data.activeOrganization)
      }

      setUser({
        id: data.user.id,
        email: data.user.email,
        ...data.user.user_metadata,
        ...(profileData || {}),
      })
    } catch (error) {
      console.error('Error in fetchUser:', error)
      setUser(null)
      setOrgs([])
      setActiveOrg(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUser()
    // Optionally, subscribe to auth state changes
    const supabase = createClient()
    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      fetchUser()
    })

    return () => {
      listener?.subscription.unsubscribe()
    }
  }, [fetchUser])

  const handleSignOut = async () => {
    setLoading(true)
    await logout()
    setUser(null)
    setOrgs([])
    setActiveOrg(null)
    setLoading(false)
  }

  const value: AuthContextProps = {
    user,
    loading,
    signIn,
    signUp,
    signOut: handleSignOut,
    refreshUser: fetchUser,
    orgs,
    activeOrg,
  }

  return (
    <AuthContext.Provider value={value}>
      <Suspense
        fallback={<div className="w-full text-center py-8">Loading...</div>}
      >
        {children}
      </Suspense>
    </AuthContext.Provider>
  )
}

function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}

export { AuthProvider, useAuth }
