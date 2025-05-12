'use client'
import SubmitBtn from '@/components/custom/submit-btn'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React from 'react'
import { signUp } from '../../actions/actions'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function SignUpForm() {
  const router = useRouter()
  async function handleSubmit(formData: FormData) {
    const res = await signUp(formData)

    if (res.error) {
      toast.error(res.error)
    }

    if (res.success) {
      toast.success(res.success)
      router.push('/auth/login')
    }
  }
  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input id="fullName" name="fullName" placeholder="John Doe" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          required
          type="email"
          placeholder="name@example.com"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phoneNumber">Phone Number</Label>
        <Input
          id="phoneNumber"
          name="phoneNumber"
          type="tel"
          placeholder="1234567890"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder="••••••••"
          required
        />
      </div>
      <SubmitBtn label="Create account" variant="default" className="w-full" />
    </form>
  )
}
