'use server'

import { createClient } from '@/utils/supabase/server'

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
