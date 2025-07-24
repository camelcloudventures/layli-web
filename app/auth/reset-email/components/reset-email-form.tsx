'use client'
import SubmitBtn from '@/components/custom/submit-btn'
import React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { resetPasswordAction } from '../../actions/actions'

export default function ResetEmailForm() {
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    const res = await resetPasswordAction(formData)

    if (res.error) {
      toast.error(res.error)
      return
    } else {
      toast.success(res.message)
      router.push('/auth/login')
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

      <SubmitBtn
        label="Send Reset Instructions"
        variant="default"
        className="w-full"
      />
    </form>
  )
}
