'use server'

import { extractTokens } from '@/utils/utils'
import { createClient } from '@/utils/supabase/server'
import { GET } from '@/app/backend/apiMethods'

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
      role: 'auditor',
      phone_number: phoneNumber,
    })
    if (profileError) {
      return { error: profileError.message }
    }

    return {
      success:
        'Account created successfully! Check your email for verification.',
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
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email as string,
      password: password as string,
    })

    if (signInError) {
      return { error: signInError.message }
    }

    return { success: 'Signed in successfully!' }
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
) {
  const supabase = await createClient()

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

    console.log('inviteError', inviteError)
    if (profileError) {
      return { error: profileError.message }
    }

    console.log('profileError', profileError)

    return { success: 'Account setup complete! Redirecting...' }
  } catch (error) {
    //@ts-expect-error - error is not typed
    return { error: error.message }
  }
}
