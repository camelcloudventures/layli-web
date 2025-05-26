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
import { signIn, signUp } from '@/app/auth/actions/actions'

interface AuthUser {
  id: string
  email: string
  full_name?: string
  role?: string
  phone_number?: string
  image?: string | undefined
  [key: string]: string | undefined
}

interface AuthContextProps {
  user: AuthUser | null
  loading: boolean
  signIn: typeof signIn
  signUp: typeof signUp
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined)

function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchUser = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()
    const { data } = await supabase.auth.getUser()

    console.log('data', data?.user?.id)

    if (
      data?.user &&
      typeof data.user.id === 'string' &&
      typeof data.user.email === 'string'
    ) {
      console.log('Supabase user id:', data.user.id)
      // Fetch profile data
      const { data: profileData, error: profileError } = await supabase
        .from('profile')
        .select('*')
        .eq('id', data.user.id)
        .single()

      console.log('Profile data:', profileData)

      if (profileError) {
        console.error('Error fetching profile:', profileError)
      }

      setUser({
        id: data.user.id,
        email: data.user.email,
        ...data.user.user_metadata,
        ...(profileData || {}), // Merge profile data if available
      })
    } else {
      setUser(null)
    }
    setLoading(false)
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
    const supabase = createClient()
    await supabase.auth.signOut()
    setUser(null)
    setLoading(false)
  }

  const value: AuthContextProps = {
    user,
    loading,
    signIn,
    signUp,
    signOut: handleSignOut,
    refreshUser: fetchUser,
  }

  return (
    <AuthContext.Provider value={value}>
      {/* <Suspense
        fallback={<div className="w-full text-center py-8">Loading...</div>}
      > */}
      {children}
      {/* </Suspense> */}
    </AuthContext.Provider>
  )
}

function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}

export { AuthProvider, useAuth }
