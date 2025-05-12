'use server'

import { extractTokens } from '@/utils/utils'
import { createClient } from '@/utils/supabase/server'
import { GET } from '@/app/backend/apiMethods'

export async function signUp(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email')
  const password = formData.get('password')
  const name = formData.get('name')
  const phoneNumber = formData.get('phoneNumber')

  try {
    const { data: authUser, error: signUpError } = await supabase.auth.signUp({
      email: email as string,
      password: password as string,
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

// export async function inviteUser(formData: FormData, role: string) {
//   const supabase = await createAdminClient()
//   const {
//     data: { user },
//     error: userError,
//   } = await supabase.auth.getUser()
//   if (userError || !user) return { error: 'User not authenticated.' }

//   const email = formData.get('email')
//   try {
//     const { data, error } = await supabase.auth.admin.inviteUserByEmail(
//       email as string,
//       {
//         redirectTo: 'http://localhost:3000/auth/invite',
//         data: { user_email: user.email },
//       },
//     )

//     if (error) return { error: error.message }

//     console.log('data', data)

//     return { success: `An invitation has been sent to ${email}` }
//   } catch (err) {
//     //@ts-expect-error - error is not typed
//     return { error: err.message }
//   }
// }

export async function acceptInvite(
  formData: FormData,
  router: string,
  role: string,
  token: string,
) {
  const supabase = await createClient()

  try {
    // 1. Validate token

    // 2. Parse hash
    const { accessToken, refreshToken } = extractTokens(router)
    if (!accessToken || !refreshToken) {
      return { error: 'Invalid or expired invite link.' }
    }

    // 3. Set session
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

    // 4. Set password
    const password = formData.get('password') as string
    const { error: updateError } = await supabase.auth.updateUser({
      password,
    })
    if (updateError) {
      return { error: updateError.message }
    }

    console.log('updateError', updateError)

    const validateRes = await GET(`/invites/validate/${token}`)
    //@ts-expect-error - error is not typed
    if (!validateRes?.success) {
      //@ts-expect-error - error is not typed
      return { error: validateRes?.error }
    }

    // 5. Update profile (optional, via your backend or Supabase)
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

    if (profileError) {
      return { error: profileError.message }
    }

    return { success: 'Account setup complete! Redirecting...' }
  } catch (error) {
    //@ts-expect-error - error is not typed
    return { error: error.message }
  }
  // Redirect to dashboard, etc.
}
