'use client'
import SubmitBtn from '@/components/custom/submit-btn'
import React from 'react'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { signIn } from '../../actions/actions'
import { toast } from 'sonner'

export default function LoginForm() {
  async function handleSubmit(formData: FormData) {
    const res = await signIn(formData)

    if (res.error) {
      toast.error(res.error)
    }

    //Se
    if (res.success) {
      toast.success(res.success)
    }
  }
  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="name@example.com"
          name="email"
          required
        />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <Link
            href="/auth/login"
            className="text-sm font-medium text-primary hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        <Input
          id="password"
          type="password"
          name="password"
          placeholder="••••••••"
          required
        />
      </div>

      <SubmitBtn label="Login" variant="default" className="w-full" />
    </form>
  )
}
