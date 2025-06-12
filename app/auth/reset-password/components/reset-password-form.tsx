'use client'
import SubmitBtn from '@/components/custom/submit-btn'
import React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { createClient } from '@/utils/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function ResetPasswordForm() {
  const supabase = createClient()
  const router = useRouter()
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const access_token = searchParams.get('access_token')

  async function handleSubmit(formData: FormData) {
    const password = formData.get('password') as string
    const verifyPassword = formData.get('verifyPassword') as string

    if (password !== verifyPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (!access_token) {
      toast.error('Missing access token')
      return
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/user`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`,
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        },
        body: JSON.stringify({ password }),
      },
    )

    const data = await res.json()
    if (!res.ok) {
      toast.error(
        data.error_description || data.msg || 'Failed to update password',
      )
      return
    }

    toast.success('Password updated successfully')
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  if (error === 'invalid' || error === 'expired' || error === 'unexpected') {
    return (
      <div className="w-full max-w-md mx-auto mt-6">
        <div className="bg-red-50 rounded-lg p-6 text-center">
          <h2 className="text-2xl font-bold mb-2 text-red-600">
            Invalid or Expired Link
          </h2>
          <p className="text-muted-foreground mb-4">
            The password reset link you used is invalid or has expired.
          </p>
          <Link
            href="/auth/reset-email"
            className="text-sm font-medium text-primary hover:underline"
          >
            Send a new reset email
          </Link>
        </div>
      </div>
    )
  }

  if (!access_token) {
    return (
      <div className="w-full max-w-md mx-auto mt-6">
        <div className="bg-red-50 rounded-lg p-6 text-center">
          <h2 className="text-2xl font-bold mb-2 text-red-600">
            Missing Access Token
          </h2>
          <p className="text-muted-foreground mb-4">
            The password reset link you used is missing an access token.
          </p>
          <Link
            href="/auth/reset-email"
            className="text-sm font-medium text-primary hover:underline"
          >
            Send a new reset email
          </Link>
        </div>
      </div>
    )
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="password">New Password</Label>
        <Input
          id="password"
          type="password"
          name="password"
          placeholder="••••••••"
          required
          minLength={8}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="verifyPassword">Verify Password</Label>
        <Input
          id="verifyPassword"
          type="password"
          name="verifyPassword"
          placeholder="••••••••"
          required
          minLength={8}
        />
      </div>

      <SubmitBtn label="Reset Password" variant="default" className="w-full" />
    </form>
  )
}
