'use client'

import SubmitBtn from '@/components/custom/submit-btn'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface SignUpStepProps {
  onSubmit: (formData: FormData) => Promise<void>
  isSubmitting: boolean
}

export default function SignUpStep({
  onSubmit,
  isSubmitting,
}: SignUpStepProps) {
  return (
    <form action={onSubmit} className="space-y-4">
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
      <SubmitBtn
        label={isSubmitting ? 'Creating Account...' : 'Create Account'}
        variant="default"
        className="w-full"
        isDisabled={isSubmitting}
      />
    </form>
  )
}
