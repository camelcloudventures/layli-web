'use server'
import { baseUrl } from './base'
import { redirect } from 'next/navigation'
import { toast } from 'sonner'
import { cookies } from 'next/headers'

function getSupabaseCookieName() {
  // Extract project ref from your Supabase URL
  const projectRef = process.env.NEXT_PUBLIC_SUPABASE_URL?.split(
    'https://',
  )[1]?.split('.')[0]
  return `sb-${projectRef}-auth-token`
}

export async function getAccessToken() {
  const cookieStore = cookies()
  const cookieName = getSupabaseCookieName()
  const accessToken = (await cookieStore).get(cookieName)?.value
  console.log('accessToken', accessToken)
  return accessToken
}

export async function UPDATE<T>(url: string, data: T): Promise<T | null> {
  try {
    const accessToken = await getAccessToken()
    if (!accessToken) {
      toast.error('You are not logged in')
      redirect('/')
      return null
    }

    const response = await fetch(`${baseUrl}/api${url}`, {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    })
    const rawResponse = await response.text()
    if (response.headers.get('content-type')?.includes('application/json')) {
      const jsonResponse = JSON.parse(rawResponse)
      if (!response.ok) {
        return jsonResponse
      }
      return jsonResponse
    }

    // @ts-expect-error --need to fix this
    return 'Unexpected response format'
  } catch (error) {
    console.error('UPDATE request failed:', error)
    return null
  }
}

export async function POST<T>(
  url: string,
  data: T,
  needsAuth: boolean = true,
  tags?: string[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> {
  console.log('data', data)
  console.log('here')
  try {
    let token: string | undefined

    if (needsAuth) {
      const accessToken = await getAccessToken()
      if (!accessToken) {
        toast.error('You are not logged in')
        redirect('/')
        return
      }
      token = accessToken
    }

    const thisUrl = `${baseUrl}/api${url}`
    console.log('thisUrl', thisUrl)
    const response = await fetch(thisUrl, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(data),
      next: tags ? { tags } : undefined,
    })
    const rawResponse = await response.text()

    // Handle JSON responses
    if (response.headers.get('content-type')?.includes('application/json')) {
      const jsonResponse = JSON.parse(rawResponse)
      if (!response.ok) {
        return jsonResponse
      }
      return jsonResponse
    }

    return 'Unexpected response format'
  } catch (error) {
    //@ts-expect-error --new
    return error.message
  }
}

export async function GET<T>(url: string, tags?: string[]): Promise<T | null> {
  try {
    const accessToken = await getAccessToken()
    if (!accessToken) {
      //@ts-expect-error --need to fix this
      return { error: 'You are not logged in' }
    }

    const thisUrl = `${baseUrl}/api${url}`
    console.log('thisUrl', thisUrl)
    const response = await fetch(thisUrl, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      cache: 'no-store',
      next: tags ? { tags } : undefined,
    })
    const rawResponse = await response.text()

    if (response.headers.get('content-type')?.includes('application/json')) {
      const jsonResponse = JSON.parse(rawResponse)
      if (!response.ok) {
        return jsonResponse
      }
      return jsonResponse
    }

    // @ts-expect-error --need to fix this
    return 'Unexpected response format'
  } catch (error) {
    console.error('GET request failed:', error)
    return null
  }
}
