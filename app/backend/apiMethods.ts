'use server'
import { baseUrl } from './base'
import { redirect } from 'next/navigation'
import { toast } from 'sonner'
import { cookies } from 'next/headers'

function getSupabaseCookieName() {
  const projectRef = process.env
    .NEXT_PUBLIC_SUPABASE_URL!.replace('https://', '')
    .split('.')[0]
  return `sb-${projectRef}-auth-token`
}

export async function getAccessToken(): Promise<string | null> {
  const cookieStore = await cookies()
  const raw = cookieStore.get(getSupabaseCookieName())?.value
  if (!raw) return null

  const [prefix, b64] = raw.split('-', 2)
  if (prefix !== 'base64' || !b64) {
    console.error('Unexpected cookie format:', raw)
    return null
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let sessionObj: any
  try {
    sessionObj = JSON.parse(Buffer.from(b64, 'base64').toString('utf8'))
  } catch (e) {
    console.error('Failed to decode session cookie', e)
    return null
  }

  // <-- take the top‐level access_token
  const token = sessionObj?.access_token

  if (!token) {
    console.error('No access_token found in session cookie:', sessionObj)
    return null
  }

  return token
}

export async function UPDATE<T>(
  url: string,
  data: T,
  tags?: string[],
): Promise<T | null> {
  try {
    const accessToken = await getAccessToken()
    if (!accessToken) {
      //@ts-expect-error --need to fix this
      return { error: 'You are not logged in' }
    }

    const response = await fetch(`${baseUrl}/api${url}`, {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
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
        Authorization: `Bearer ${accessToken}`,
      },
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

export async function DELETE<T>(
  url: string,
  data: T,
  tags?: string[],
): Promise<T | null> {
  try {
    const accessToken = await getAccessToken()
    if (!accessToken) {
      //@ts-expect-error --need to fix this
      return { error: 'You are not logged in' }
    }

    const thisUrl = `${baseUrl}/api${url}`
    const response = await fetch(thisUrl, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
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
    console.error('DELETE request failed:', error)
    return null
  }
}
