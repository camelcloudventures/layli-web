'use server'

import { extractTokens } from '@/utils/utils'
import { createClient } from '@/utils/supabase/server'
import { GET, POST } from '@/app/backend/apiMethods'
import { cookies } from 'next/headers'

export async function signUp(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email')
  const password = formData.get('password')
  const name = formData.get('fullName')
  const phoneNumber = formData.get('phoneNumber')

  try {
    const { data: authUser, error: signUpError } = await supabase.auth.signUp({
      email: email as string,
      password: password as string,
      options: {
        emailRedirectTo: process.env.SITE_URL,
        data: {
          name: name as string,
        },
      },
    })

    if (signUpError) {
      return { error: signUpError.message }
    }

    const { error: profileError } = await supabase.from('profile').insert({
      id: authUser!.user?.id,
      full_name: name,
      email,
      role: 'admin',
      phone_number: phoneNumber,
    })
    if (profileError) {
      return { error: profileError.message }
    }

    return {
      success:
        'Account created successfully! Check your email for verification.',
      user: authUser!.user?.id,
    }
  } catch (err) {
    //@ts-expect-error - error is not typed
    return { error: err.message }
  }
}

export async function signIn(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email')
  const password = formData.get('password')

  try {
    const {
      data: signInData,
      error: signInError,
    } = await supabase.auth.signInWithPassword({
      email: email as string,
      password: password as string,
    })

    if (signInError) {
      return { error: signInError.message }
    }

    const { error: setSessionError } = await supabase.auth.setSession({
      access_token: signInData.session?.access_token,
      refresh_token: signInData.session?.refresh_token,
    })

    if (setSessionError) {
      return { error: setSessionError.message }
    }

    // Fetch organization context immediately after successful sign in
    const orgContext = await getUserOrganizations()

    if (!orgContext?.success) {
      return { error: 'Failed to load organization data' }
    }

    return {
      success: 'Signed in successfully! Redirecting...',
      user: signInData.user,
      organizations: orgContext.data.organizations,
      activeOrganization: orgContext.data.activeOrganization,
    }
  } catch (err) {
    //@ts-expect-error - error is not typed
    return { error: err.message }
  }
}

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()
  if (userError || !user) return { error: 'User not authenticated.' }

  try {
    const fullName = formData.get('fullName') as string
    const phoneNumber = formData.get('phoneNumber') as string
    const image = formData.get('image') as string | null

    const updateData: {
      full_name: string
      phone_number: string
      image?: string
    } = { full_name: fullName, phone_number: phoneNumber }
    if (image) updateData.image = image

    const { error } = await supabase
      .from('profile')
      .update(updateData)
      .eq('id', user.id)

    if (error) return { error: error.message }
    return { success: 'Profile updated successfully.' }
  } catch (err) {
    //@ts-expect-error - error is not typed
    return { error: err.message }
  }
}

export async function acceptInvite(
  formData: FormData,
  router: string,
  role: string,
  token: string,
  orgId: string,
) {
  const supabase = await createClient()

  const cookieStore = await cookies()
  cookieStore.set('active_org', orgId, {
    path: '/',
    sameSite: 'lax',
  })
  try {
    const { accessToken, refreshToken } = extractTokens(router)
    if (!accessToken || !refreshToken) {
      return { error: 'Invalid or expired invite link.' }
    }

    const {
      data: sessionData,
      error: sessionError,
    } = await supabase.auth.setSession({
      access_token: accessToken!,
      refresh_token: refreshToken!,
    })
    if (sessionError) {
      return { error: sessionError.message }
    }

    console.log('sessionData', sessionData)

    const password = formData.get('password') as string
    const { error: updateError } = await supabase.auth.updateUser({
      password,
    })
    if (updateError) {
      return { error: updateError.message }
    }

    const validateRes = await GET(`/invites/validate/${token}`)

    console.log('Token value', token)
    //@ts-expect-error - error is not typed
    if (!validateRes?.success) {
      //@ts-expect-error - error is not typed
      return { error: validateRes?.error }
    }

    const fullName = formData.get('fullName') as string
    const phoneNumber = formData.get('phoneNumber') as string
    const { error: profileError } = await supabase.from('profile').insert({
      id: sessionData.user?.id,
      full_name: fullName,
      phone_number: phoneNumber,
      email: sessionData.user?.email,
      role,
      email_verified_at: new Date(),
    })

    //Add the user to the invite table
    const { error: inviteError } = await supabase
      .from('invites')
      .update({
        user_id: sessionData.user?.id,
      })
      .eq('token', token)

    if (inviteError) {
      return { error: inviteError.message }
    }

    // Add the user to organization_members
    const { error: orgMemberError } = await supabase
      .from('organization_members')
      .insert({
        organization_id: orgId,
        user_id: sessionData.user?.id,
        role: role,
        is_default: true,
      })

    if (orgMemberError) {
      return { error: orgMemberError.message }
    }

    if (profileError) {
      return { error: profileError.message }
    }

    // Set the active organization in cookies

    return { success: 'Account setup complete! Redirecting...' }
  } catch (error) {
    //@ts-expect-error - error is not typed
    return { error: error.message }
  }
}

interface OrgResponse {
  success: boolean
  data: {
    user: {
      id: string
      email: string
      full_name?: string
      role?: string
      phone_number?: string
      image?: string
    }
    organizations: Array<{
      id: string
      name: string
      type?: string
      created_at: string
      updated_at: string
      created_by: string
    }>
    orgMemberships: Array<{
      organization_id: string
      role: string
      is_default: boolean
    }>
    activeOrganization: {
      id: string
      name: string
      type?: string
      created_at: string
      updated_at: string
      created_by: string
    }
  }
}

export async function createOrganization(formData: FormData, user: string) {
  try {
    const name = formData.get('name') as string
    const type = formData.get('type') as string

    const data = {
      name,
      type,
      created_by: user,
    }
    // Skip organization check since this is creating a new organization
    // and there won't be an active organization yet
    const res = await POST('/organizations/create', data, false)
    console.log('res from createOrganization', res)
    return res
  } catch (error) {
    //@ts-expect-error - error is not typed
    return { error: error.message }
  }
}

export async function getUserOrganizations() {
  const response = await GET<OrgResponse>('/auth/context', undefined, true)
  console.log('response from getUserOrganizations', response)

  if (response?.success && response?.data?.activeOrganization) {
    const cookieStore = await cookies()
    cookieStore.set('active_org', response.data.activeOrganization.id, {
      path: '/',
      sameSite: 'lax',
    })
  }

  return response
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  const cookieStore = await cookies()
  cookieStore.delete('active_org')
}
