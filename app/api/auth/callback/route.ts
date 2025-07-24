import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  console.log('callback route pinged')
  console.log('req', req)
  const requestUrl = new URL(req.url)
  const { searchParams } = requestUrl
  const code = searchParams.get('code')
  const origin = requestUrl.origin

  if (!code) {
    return NextResponse.redirect(`${origin}/auth/reset-password?error=invalid`)
  }

  const supabase = await createClient()

  try {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    console.log('data', data)
    console.log('error', error)

    if (error || !data?.session) {
      return NextResponse.redirect(
        `${origin}/auth/reset-password?error=expired`,
      )
    }

    // Pass tokens to the client
    const { access_token, refresh_token } = data.session
    console.log('access_token', access_token)
    console.log('refresh_token', refresh_token)
    return NextResponse.redirect(
      `${origin}/auth/reset-password?access_token=${access_token}&refresh_token=${refresh_token}`,
    )
  } catch (err) {
    console.error('Unexpected error during auth code exchange:', err)
    return NextResponse.redirect(
      `${origin}/auth/reset-password?error=unexpected`,
    )
  }
}
